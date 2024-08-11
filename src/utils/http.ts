import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/apis/auth.api'
import { HttpStatusCode } from 'src/constants/HttpStatusCode.enum'
import config from 'src/constants/config'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import { clearLS, getTokenFromLS, setProfileToLS, setTokenToLS } from './auth'

import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosExpiredTokenError } from './util'

// ví dụ nè
// cái API Purchase nó gọi từ 1-3 (giây)
// còn cái getMe từ 4-5
// trong trường hợp mà token hết hạn
//  thì nó sẽ gọi lại API refreshtoken
// mà trường hợp mà mình chưa gọi settimeOut để giữ refreshToken
// ví dụ  hết hạn và gọi token
// Purchase (4-5s ) sau đó
// getME (5-6s)
//  thì mà sau khi gọi xong thì finally sẽ tự động set thành null
// mà là null thì đâu có đâu nên thằng getMe gọi sau sẽ phải gọi lại lần nữa
// => điều này dẫn đến là API gọi lại 2 lần
// nên là mình thêm setTimeOut set là 10s, sau 10s thì hả null
// đều này làm cho tránh bị gọi lại 2 lần và tiết kiệm được thời gian và tránh bug

class Http {
  // khi mà chúng ta khai báo biến thì chúng ta phải khai nó trong constructor
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    const { access_token, refresh_token } = getTokenFromLS()
    // getToken*(constructor chạy) chỗ này là giúp chúng ta lưu trên thanh ram
    // Và điều này nó giúp chúng ta tốc ưu tốc độ xử lý
    this.accessToken = access_token
    this.refreshToken = refresh_token
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60 * 24, // 1 ngày
        'expire-refresh-token': 60 * 60 * 24 * 160 // 160 ngày
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        console.log(config)

        if (this.accessToken && config) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    //  cấu hình response trả về
    this.instance.interceptors.response.use(
      // chỗ này đổi thành arf để sử dụng this
      (response) => {
        console.log(response)

        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data
          this.accessToken = (response.data as AuthResponse).data?.access_token
          this.refreshToken = (response.data as AuthResponse).data?.refresh_token
          setTokenToLS({ accessToken: this.accessToken, refreshToken: this.refreshToken })
          setProfileToLS(data.data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      //  thằng dùng để hanle lỗi mà không phải lỗi 422(lỗi linh tinh-167)
      (error: AxiosError) => {
        // chỉ toast cái lỗi không phải của 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          console.log(data)

          //  nếu maf data.message thì không có thì dùng error.message
          const message = data?.message || error.message
          toast.error(message)
        }
        if (isAxiosExpiredTokenError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || { headers: {}, url: '' }
          console.log(config)

          const { url } = config
          // lỗi 401 có rất nhiều trường hợp
          // - Token không đúng
          // - không truyền lên token
          // - token hết hạn
          // nếu mà lỗi 401 (là do token bị hết hạn , sau khi hết hannj chúng ta sẽ chèn 1 ký tự)
          // để phá cái token đó nên là có cái lỗi này
          // clearLS  này xóa tất cả các thông tin có trong LS
          // này mới clear trên LS thoi nha, chúng ta phải lun trên thằng Context nữa
          //---------------------------------------------------
          // Trường hợp Token hết hạn và request đó không phải là của request refresh token
          // thì chúng ta mới tiến hành gọi refresh token
          // có nghĩa là khi mà chúng ta chỉ gọi khi mà cái request đó không phải là request refresh token thì mới gọi
          //  chứ nếu mà là cái request đó mà gọi mà bị lỗi thì gọi chi nữa
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            // hạn chế gọi 2 lần refresh token

            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // giữ cái requestTokenRequest trong 10 s cho những request nào cần, cho những thằng khác
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            // tại sao phải return chỗ này

            // đơn giản nếu không return thì khi mà thành công thì nó vẫn xuống clearLS là chết nên là phải return
            return this.refreshTokenRequest.then((access_token) => {
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }
          // còn những trường họpư token không đúng
          // không truyền token
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xóa sạch local storage và toast message

          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          // sau khi clear reload trang
          // này là reload cũng đc nhưng mà kh nên
          //window.location.reload()
          toast.error(error.response?.data.data?.message || error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http

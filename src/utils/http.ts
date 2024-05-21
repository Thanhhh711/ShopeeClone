
import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { HttpStatusCode } from 'src/constants/HttpStatusCode.enum'
import { AuthResponse } from 'src/types/auth.type'
import { clearLS, getAccessTokenFormLS, saveAccessTokenToLS, setProfileToLS } from './auth'
import path from 'src/constants/path'

class Http {
  // khi mà chúng ta khai báo biến thì chúng ta phải khai nó trong constructor
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    // getToken*(constructor chạy) chỗ này là giúp chúng ta lưu trên thanh ram
    // Và điều này nó giúp chúng ta tốc ưu tốc độ xử lý
    this.accessToken = getAccessTokenFormLS()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.resolve(error)
      }
    )
    //  cấu hình response trả về
    this.instance.interceptors.response.use(
      // chỗ này đổi thành arf để sử dụng this
      (response) => {
        const { url } = response.config
        if (url === path.login || url === path.register) {
          const data = response.data
          this.accessToken = (response.data as AuthResponse).data?.access_token
          saveAccessTokenToLS(this.accessToken)
          setProfileToLS(data.data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      //  thằng dùng để hanle lỗi mà không phải lỗi 422(lỗi linh tinh-167)
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          console.log(data)

          //  nếu maf data.message thì không có thì dùng error.message
          const message = data.message || error.message
          toast.error(message)
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http

import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constants/HttpStatusCode.enum'

// type redicate
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error as any)
}

//  đây là hàm dùng để check lỗi có phải 422
export function isAxiosUnprocessableEntityError<FromError>(error: unknown): error is AxiosError<FromError> {
  console.log('error', error)

  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

//  đây 2 hàm dung để biến đổi tiền và số lượng bán hàng bằng js
//  trong react buổi 180(179 hong nhớ )
export function fomatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function FormatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}

//  cái chỗ export const này nếu mà mình dùng kiểu dưới
// export function rateSale
//  thì nó sẽ không sử dụng đc arrow function nha

export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%'

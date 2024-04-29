import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constants/HttpStatusCode.enum'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error as any)
}

export function isAxiosUnprocessableEntityError<FromError>(error: unknown): error is AxiosError<FromError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

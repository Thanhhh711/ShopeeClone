import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expire_efresh_token: number
  expires: number
  user: User
}>

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string
}>

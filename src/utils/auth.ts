import { User } from 'src/types/user.type'

export const saveAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFormLS = () => localStorage.getItem('access_token') || ''

export const getProfileFromLS = () => {
  //  lấy xuống là string
  const result = localStorage.getItem('profile')
  // parse thành obj để xài
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

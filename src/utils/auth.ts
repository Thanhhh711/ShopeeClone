import { User } from 'src/types/user.type'

// do là token hết hạn chúng ta không nên chơi reload trang chún ta dùng cách này
export const LocalStrorageEventTarget = new EventTarget()

export const saveAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  // cái despatchEvent này nhận vào 1 cái event
  // new Event('clearLS') cần truyền vào 1 cái string
  //  const clearLSEvent = new Event('clearLS')
  //--- truyền vầy oke hơn
  LocalStrorageEventTarget.dispatchEvent(new Event('clearLS'))
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

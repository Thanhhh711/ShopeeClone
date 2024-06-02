const path = {
  home: '/',
  profile: '/user/profile',
  user: '/user',
  changePassword: '/user/changePassword',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path

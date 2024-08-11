import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import HOME_VI from 'src/locales/vi/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
// thằng này là mìnht tự viết để render ra
export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

// cái này được copyt từ thư viên i18next của react đọc doc
export const resources = {
  en: {
    // translation được imoport từ nameSpace
    // translation: {
    //   'all categories': 'All categories',
    //   'filter search': 'Filter'
    // } // đây là cách sử dụng trước có floder locales

    // đây là các nameSpace
    home: HOME_EN,
    product: PRODUCT_EN
  },
  vi: {
    // translation: {
    //   'all categories': 'Tất cả danh mục',
    //   'filter search': 'Bộ lọc tìm kiếm'
    // }

    // đây là các nameSpace
    home: HOME_VI,
    product: PRODUCT_VI
  }
} as const

export const defaultNS = 'home'

// bên file import vào r thì mới sử dụng được thằng này
i18n.use(initReactI18next).init({
  // resources lấy ở trên
  resources,
  lng: 'vi', // đây là mới vào ngôn ngữ mặc định
  fallbackLng: 'vi', // đây là trường hợp mà web nó khôn xác định được web sử dụng ngôn ngữ nào
  ns: ['home', 'product'], // đây là nameSpace
  defaultNS, // đây là trường hợp mặc định nếu không biết các thuộc tính trong name Space là của NameSpace nào
  // ví dụ
  /*
t('welcomeMessage') // Nếu không có defaultNS, bạn cần phải làm như thế này: t('home:welcomeMessage')
*/

  interpolation: {
    escapeValue: false // thằng này được sử dụng để tránh trường hợp tất công xss
    //   mà bản thân thằng react đã chống được r, nên thằng này để false cũng đc
  }
})

export default i18n

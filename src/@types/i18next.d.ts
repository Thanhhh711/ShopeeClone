import 'i18next'
import { defaultNS, resources } from 'src/i18n/i18n'

declare module 'i18next' {
  // kế thừa (thêm vào type)
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS

    // nên lấy ngôn ngữ mặc định của chúng ta
    resources: (typeof resources)['vi']
  }
}

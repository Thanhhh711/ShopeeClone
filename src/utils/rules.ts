import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

//----------------------------------------------------------------
type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}
//  taị sao phải tạo type như z ?
//  để tránh bị viết sai thuộc tính của lỗi

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: { value: true, message: 'Email là bắt buộc' },
    pattern: {
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Email không được quá 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Email không được ít hơn 5 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Mật khẩu là bắt buộc'
    },
    minLength: {
      value: 6,
      message: 'Mật khẩu phải có ít nhất 6 ký tự'
    },
    maxLength: {
      value: 20,
      message: 'Mật khẩu phải có tối đa 20 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Mật khẩu là bắt buộc'
    },
    minLength: {
      value: 6,
      message: 'Mật khẩu phải có ít nhất 6 ký tự'
    },
    maxLength: {
      value: 20,
      message: 'Mật khẩu phải có tối đa 20 ký tự'
    },

    // validate có thể là obj or func but return true if true
    // return string if false otherwise
    validate:
      typeof getValues === 'function'
        ? (value) => (value === getValues('password') ? true : 'password không khớp')
        : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as {
    price_min: string
    price_max: string
  }
  if (price_min !== '' && price_max !== '') {
    return Number(price_min) < Number(price_max)
  }
  return price_min !== '' || price_max !== ''
}

//---------------------------Này là chúng ta dùm yup---------------------------------
export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5-160 ký tự')
    .max(160, 'Độ dài từ 5-160 ký tự'),
  password: yup
    .string()
    .required('Passwỏd là bắt buộc')
    .min(6, 'Độ dài từ 6-160 ký tự')
    .max(160, 'Độ dài từ 6-160 ký tự'),
  confirm_password: yup
    .string()
    .required('Passwỏd là bắt buộc')
    .min(6, 'Độ dài từ 6-160 ký tự')
    .max(160, 'Độ dài từ 6-160 ký tự')
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp '),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

// export const SchemaLogin = schema.omit(['confirm_password'])

// export type LoginSchema = yup.InferType<typeof schemaLogin>

//  thằng này giúp tạo 1 cái interface mà không cần phải tạo 1 cái interface
export type Schema = yup.InferType<typeof schema>

import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { registerAccount } from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { ResponseApi } from 'src/types/utils.type'
import { getRules, schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/util'

type FormData = Schema

export default function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    setError,

    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  // const rules = getRules(getValues)
  //--------------------------------------------
  // watch nó sẽ Rerender mỗi lần chúng ta nhập dữ liệu
  // nếu chúng ta không truyền gì thì mỗi lần chúng ta nhập
  //  thì nó sẽ Rerender lại hết
  //  nếu chúng ta truyền nó là thằng nào thì thằng đó được nhập
  //  thì nó mới Rerender
  // const data = watch('password')
  // console.log(data)
  //-------------------------------------
  //  thằng handleSubmit nhận vào 1 cái Valid và InValid?
  const onSubmit = handleSubmit((data) => {
    console.log(data)

    const body = omit(data, ['confirm_password'])

    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })
  console.log('errros:', errors)

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='gird gird-cols-1 lg:gird-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng Ký</div>
              <Input
                name='email'
                type='email'
                placeholer='email'
                className='mt-8'
                register={register}
                errorMessage={errors.email?.message}
              />

              <Input
                name='password'
                type='password'
                placeholer='password'
                className='mt-2'
                register={register}
                errorMessage={errors.password?.message}
                autoComplete='on'
              />

              <Input
                name='confirm_password'
                type='password'
                placeholer='Confirm_password'
                className='mt-2'
                register={register}
                errorMessage={errors.confirm_password?.message}
                autoComplete='on'
              />
              <div className='mt-2'>
                <button className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'>
                  Đăng Ký
                </button>
              </div>
              <div className='mt-8 '>
                <div className='flex items-center justify-center'>
                  <span className='text-gray-600 mr-2'>Bạn đã có tài khoảng chưa</span>
                  <Link className=' text-red-400 mr-2' to='/Login'>
                    Đăng nhâp
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

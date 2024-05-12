import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'

import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.contexts'
import { ErrorResponse } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/util'

//  do là login mình đâu cần thằng này
// type FormData = Schema
//  pick(chọn) thì trái lại với omit(loại)
type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } =
    useContext(AppContext)
  const navigate = useNavigate()
  //  đây là những thuộc tính có sẵn ở trong useForm

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (
      body: Omit<FormData, 'confirm_password'>
    ) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        // navigate đươc dùng để điều hướng (in case này là tới thằng /)

        setProfile(data.data.data?.user)
        // dấu / đại diện trang hiện tại
        navigate('/')
      },
      onError: (error) => {
        //  khi mà server trả về đó là 1 cái response lỗi nên là dùng generic định dạng lỗi truyền vào
        if (
          isAxiosUnprocessableEntityError<
            ErrorResponse<FormData>
          >(error)
        ) {
          // chỗ nảy ra được
          // email: email không tồn tại
          const formError = error.response?.data.data

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  const value = watch()
  console.log(value, errors)

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form
              className='p-10 rounded bg-white shadow-sm'
              onSubmit={onSubmit}
            >
              <div className='text-2xl'>Đăng Nhập</div>
              <Input
                name='email'
                type='email'
                placeholder='email'
                className='mt-8'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                type='password'
                placeholder='password'
                className='mt-1'
                register={register}
                errorMessage={errors.password?.message}
                autoComplete='on'
              />

              <div className='mt-3'>
                <Button
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center'
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 '>
                <div className='flex items-center justify-center'>
                  <span className='text-gray-600 mr-2'>
                    Bạn chưa có tài khoảng{' '}
                  </span>
                  <Link
                    className='text-red-400'
                    to='/Register'
                  >
                    Đăng Ký
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

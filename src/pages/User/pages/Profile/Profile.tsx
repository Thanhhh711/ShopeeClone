import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'

import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.contexts'
import { setProfileToLS } from 'src/utils/auth'

type FormData = Pick<userSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])
export default function Profile() {
  const { setProfile } = useContext(AppContext)

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      // tháng nó bắt đầu bằng số 0
      date_of_birth: new Date(1990, 0, 1),
      avatar: ''
    },
    resolver: yupResolver(profileSchema)
  })

  // cho data này 1 cái aliat name để dễ gọi
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    // thằng này cũng như vậy mà cách viết khác
    // queryFn: () => userApi.getProfile(),
    queryFn: userApi.getProfile // thằng này cũng là 1 call bakc
  })

  const profile = profileData?.data.data
  const updateProfileMutation = useMutation({ mutationFn: userApi.updateProfile })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || ''),
        setValue('avatar', profile.avatar || ''),
        setValue('phone', profile.phone || ''),
        setValue('address', profile.address || ''),
        setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)

    const res = await updateProfileMutation.mutateAsync({
      ...data,
      date_of_birth: data.date_of_birth?.toISOString()
    })
    setProfile(res.data.data)
    setProfileToLS(res.data.data)
    // refresh lại API
    refetch()
    toast.success(res.data.message)
  })

  return (
    <div className=' pb=10 rounded-sm bg-white px-2 shadow   md:px-7 md:pb-20 '>
      <div className='border-b border-b-gray py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo vệ tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          {/* email */}
          <div className='flex   flex-wrap  flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>

          <div className=' mt-6 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right  capitalize'>Tên</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <Input
                className='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>

          {/*  số điện thoại */}
          <div className=' mt-2 flex flex-wrap flex-col sm:flex-row '>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    className='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className=' mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right  capitalize'>Địa chỉ</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <Input
                className='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>

          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => {
              return (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  onChange={field.onChange}
                  value={field.value}
                />
              )
            }}
          />

          <div className=' mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='rounded-sm flex items-center h-9 bg-orange px-5 text-center  text-white hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>

        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                className='h-full w-full rounded-full object-cover'
                src='https://down-vn.img.susercontent.com/file/vn-11134226-7r98o-luqbzvje8weqe3_tn'
              />
            </div>
            <input className='hidden' type='file' accept='jpg,.jeg,.png' />
            <button
              type='button'
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dung lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

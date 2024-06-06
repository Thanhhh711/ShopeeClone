import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'

import { toast } from 'react-toastify'
import InputFile from 'src/components/InputFile'
import { AppContext } from 'src/contexts/app.contexts'
import { ErrorResponse } from 'src/types/utils.type'
import { setProfileToLS } from 'src/utils/auth'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/util'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()

  return (
    <Fragment>
      {/*  tên */}
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
    </Fragment>
  )
}

// Có 2 flow up ảnh hiện nay
/*
  Flow 1: ưu điểm: nhanh, nhược điểm: user dễ spam(kiểu ngta đổi ảnh liên tục, server có ảnh mà kh ngta kh lưu)
Nhấn upload: upload lên server luôn => server trả về url ảnh
Nhấn submit thì gửi url ảnh cộng với data lên server

Flow 2: nhược điểm: chậm do thực hiện thuần tự, ưu điểm(ngược lại nhược điểm vs Flow 1)
Nhấn upload: không upload lên server
Nhấn submit thì tiến hành upload lên server, nếu upload thành công thì tiến hành gọi api updateProfile



*/

export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setProfile } = useContext(AppContext)

  const [file, setFile] = useState<File>()

  const preViewImage = useMemo(() => {
    //tạo url từ cái file
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  // cho data này 1 cái aliat name để dễ gọi
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    // thằng này cũng như vậy mà cách viết khác
    // queryFn: () => userApi.getProfile(),
    queryFn: userApi.getProfile // thằng này cũng là 1 call bakc
  })

  const profile = profileData?.data.data
  const updateProfileMutation = useMutation({ mutationFn: userApi.updateProfile })

  const uploadAvatarMutation = useMutation({ mutationFn: userApi.uploadAvatar })

  //  đây là 1 kĩ thuật dùng form contexxt
  const methods = useForm<FormData>({
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

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = methods

  // xem giá trị của avatar
  const avatar = watch('avatar')
  console.log('avatar', avatar)

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
    try {
      let avatarName = avatar
      if (file) {
        // cái formData này là của JS nha =))
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        console.log(uploadRes.data.data)

        // Do là ông được ông trả về cái name của cái ảnh, chứ kh phai là url
        //uploadRes.data.data đây giá trik từ sever trả về
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      // refresh lại API
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      console.log(error)
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (file: File) => {
    setFile(file)
  }

  return (
    <div className=' pb=10 rounded-sm bg-white px-2 shadow   md:px-7 md:pb-20 '>
      <div className='border-b border-b-gray py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo vệ tài khoản</div>
      </div>

      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow pr-12 md:mt-0'>
            {/* email */}
            <div className='flex   flex-wrap  flex-col sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
              <div className='sm:w-[80%]  sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>

            <Info />

            {/* địa chỉ */}
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
                <img src={preViewImage || getAvatarUrl(avatar)} className='h-full w-full rounded-full object-cover' />
              </div>
              <InputFile onChange={() => handleChangeFile} />
              <div className='mt-3 text-gray-400'>
                <div>Dung lượng file tối đa 1 MB</div>
                <div>Định dạng:.JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

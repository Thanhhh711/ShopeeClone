import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

export default function Login() {
  //  đây là những thuộc tính có sẵn ở trong useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <div className='bg-orange'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='gird gird-cols-1 lg:gird-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng Nhập</div>
              <div className='mt-8'>
                <input
                  type='email'
                  name='email'
                  className='p-3 w-full outline-none border border-gray-300 forcus:border-gray-500 forcus:shawdow-sm rounded-sm'
                  placeholder='email'
                />
                <div className='mt-1 text-red-600 min-h-[1rem] text-sm'> </div>
              </div>
              <div className='mt-3'>
                <input
                  type='password'
                  name='password'
                  autoComplete='on'
                  className='p-3 w-full outline-none border border-gray-300 forcus:border-gray-500 forcus:shawdow-sm rounded-sm'
                  placeholder='password'
                />
                <div className='mt-1 text-red-600 min-h-[1rem] text-sm'> </div>
              </div>
              <div className='mt-3'>
                <button className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'>
                  Đăng nhập
                </button>
              </div>
              <div className='mt-8 '>
                <div className='flex items-center justify-center'>
                  <span className='text-gray-600 mr-2'>Bạn chưa có tài khoảng </span>
                  <Link className='text-red-400' to='/Register'>
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

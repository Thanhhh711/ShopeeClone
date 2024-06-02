import Input from 'src/components/Input'

export default function Profile() {
  return (
    <div className=' pb=10 rounded-sm bg-white px-2 shadow   md:px-7 md:pb-20 '>
      <div className='border-b border-b-gray py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo vệ tài khoản</div>
      </div>
      <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <form action='' className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='flex   flex-wrap  flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <div className='pt-3 text-gray-700'>th*********@gmail.com</div>
            </div>
          </div>
          <div className=' mt-6 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right  capitalize'>Tên</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <Input className='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm' />
            </div>
          </div>
          <div className=' mt-2 flex flex-wrap flex-col sm:flex-row '>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <Input className='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm' />
            </div>
          </div>
          <div className=' mt-2 flex flex-wrap flex-col sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right  capitalize'>Địa chỉ</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <Input className='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm' />
            </div>
          </div>

          <div className=' mt-2 flex flex-wrap'>
            <div className='sm:w-[20%] truncate pt-3 text-right capitalize'>Ngày sinh</div>
            <div className='sm:w-[80%]  sm:pl-5'>
              <div className='flex justify-between'>
                <select className='h-10 w-[32%] rounded-sm border  border-black/10 px-3'>
                  <option disabled>ngày</option>
                </select>
                <select className='h-10 w-[32%] rounded-sm  border border-black/10 px-3'>
                  <option disabled>Tháng</option>
                </select>
                <select className='h-10 w-[32%] rounded-sm  border border-black/10 px-3'>
                  <option disabled>Năm</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                className='h-full w-full rounded-full object-cover'
                src='https://down-vn.img.susercontent.com/file/vn-11134226-7r98o-luqbzvje8weqe3_tn'
              />
            </div>
            <input className='hidden' type='file' accept='jpg,.jeg,.png' />
            <button className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'>
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dung lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import UserSideNav from '../../components/UserSideNav'

export default function UserLayout() {
  return (
    <div className='bg-neutral-100 py-16 text-sm-gray-600'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-3 lg:col-span-2'>
            <UserSideNav />
          </div>
          <div className='md:col-span-9 lg:col-span-10'>
            {/* khi mà xài outlet rồi là không có truyênf compoentn đc đâu nha */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

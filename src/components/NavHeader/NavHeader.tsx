import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.contexts'
import { getAvatarUrl } from 'src/utils/util'
import Popover from '../Popover'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'

export default function NavHeader() {
  // cái thằng i18n này nó sẽ tham chíu đến i18n.use(initReactI18next).init trong file i18n
  const { i18n } = useTranslation()
  // chỗ này có lỗi là do nó không biết có chắc chắn nó là kiểu của locales hong
  // nên là mình ếp kiểu nó
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  // useQueryClinet này nó giông như là useContext  vậy á
  //  nếu chúng ta dùng như này thì nó giống như là sử dụng queryCLient bên thằng main vậy á
  const queryClient = useQueryClient()
  const {
    // thằng này dùng để check nếu người người dùng chưa đăng nhập
    //  thì hiên đăng nhâp
    isAuthenticated,
    setIsAuthenticated,
    setProfile,
    profile
  } = useContext(AppContext)

  //  đây là những thuộc tính có sẵn ở trong useForm
  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      // khi đăng xuất thì xóa có số hàng trong giỏ
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const changeLanguage = (lng: 'en' | 'vi') => {
    // lng là gì
    //  là tất cả các key có trong rescouce của file inn18

    i18n.changeLanguage(lng)
  }

  return (
    <div className='container'>
      {/*  qua trái */}
      <div className='flex justify-end'>
        <Popover
          as='span'
          className='flex items-center py-1 hover:text-white/70 cursor-pointer'
          renderPopover={
            <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
              <div className='flex flex-col py-2 pr-28 pl-3'>
                <button onClick={() => changeLanguage('vi')} className='button py-2 px-3 hover:text-orange'>
                  Tiếng Việt
                </button>
                <button onClick={() => changeLanguage('en')} className='button py-2 px-3 hover:text-orange mt-2'>
                  English
                </button>
              </div>
            </div>
          }
        >
          {/*  trái đất */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>

          {/*  mặc định mới vào là tiếng việt */}
          <div className='mx-1'>{currentLanguage}</div>
          {/*  mũi tên */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
          </svg>
        </Popover>

        {isAuthenticated && (
          <Popover
            className='flex items-center py-1 hover:text-white/70 cursor-pointer ml-6'
            renderPopover={
              <div className='shadow-md rounded-sm border border-gray-200'>
                <Link
                  to={path.profile}
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to={path.historyPurchase}
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                >
                  Đơn Mua
                </Link>
                <button
                  onClick={handleLogout}
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className='w-5 h-5 mr-2 flex-shink-0'>
              {/*  avataer */}
              <img
                src={getAvatarUrl(profile?.avatar)}
                alt='avatar'
                className='w-full h-full object-cover rounded-full'
              />
            </div>
            <div>{profile?.email}</div>
          </Popover>
        )}

        {/*  cái này dùng để show tiếng việt khi hover vào */}

        {!isAuthenticated && (
          <div className='flex items-center'>
            <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
              Đăng ký
            </Link>
            <div className='border-r-[1px] border-r-white/40 h-4' />
            <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
              Đăng Nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

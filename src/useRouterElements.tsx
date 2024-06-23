import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from '../src/constants/path'
import { AppContext } from './contexts/app.contexts'
import MainLayout from './layouts/MainLayout/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'

import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layout/UserLayout'

//  mình chơi lazy load có nghĩa là chơi tới đâu tải tới đó
// thuận lợi là user không cần phải tải nguyên cái component trong lần đầu,
// do người ta chỉ sử dụng vài trang thoi nên không cần load hết
const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList/components'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/PageNotFound'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  //  nếu có token thì khỏi phải login
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  //  hàm này dùng cho là khi đã login rồi thì không cho login| regis nưa
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
//  nơi đây sẽ cấu hình phân trang
export default function useRouterElements() {
  // nó là mảng nha
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      // kiểu như mún vào con thì phải đi qua cha
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              {/* kiểu như đợi login đàng load thì show này ra cho người dùng */}
              <Suspense fallback={<div>loading</div>}>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              {/*  DO là minh sử dụng Outlet, nên là kho không có children */}
              {/*  */}

              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              //  nên là mấy thằng này sẽ được chèn vào chỗ của outlet
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '',
      index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: path.historyPurchase,
      index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
      element: (
        <MainLayout>
          <Suspense>
            <HistoryPurchase />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '*',
      index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
      element: (
        <MainLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])
  return routeElements
}

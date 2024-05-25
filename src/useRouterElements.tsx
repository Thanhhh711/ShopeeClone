import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from '../src/constants/path'
import { AppContext } from './contexts/app.contexts'
import MainLayout from './layouts/MainLayout/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import ProductList from './pages/ProductList/components'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  //  nếu có token thì khỏi phải login
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  //  hàm này dùng cho là khi đã login rồi thì không cho login| regis nưa
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/profile' />
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
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
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
          path: path.profile,
          index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: path.cart,
          index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: path.productDetail,
      index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      index: true, // để tránh nó kh find được gòi lại rơi vào vòng lặp vô hạn
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    }
  ])
  return routeElements
}

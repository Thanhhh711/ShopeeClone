import { ToastContainer } from 'react-toastify'
import useRouterElements from './useRouterElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { LocalStrorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.contexts'
function App() {
  const routerElements = useRouterElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    // lắng nghe sự kiện clearLS trong LocalStrorageEventTarget
    LocalStrorageEventTarget.addEventListener('clearLS', reset)
    // có nghĩa là sau khi  hàm chạy xong thì ta xóa cái sự kiên đó
    // kết thúc nó tránh bị rò rỉ bộ nhớ
    return () => {
      LocalStrorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <div>
      {routerElements}

      {/*  dùng để thể hiện lỗi linh tinh */}
      <ToastContainer />
    </div>
  )
}

export default App

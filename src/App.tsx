import { ToastContainer } from 'react-toastify'
import useRouterElements from './useRouterElements'
import 'react-toastify/dist/ReactToastify.css'
function App() {
  const routerElements = useRouterElements()
  return (
    <div>
      {routerElements}

      {/*  dùng để thể hiện lỗi linh tinh */}
      <ToastContainer />
    </div>
  )
}

export default App

import useRouterElements from './useRouterElements'

function App() {
  const routerElements = useRouterElements()
  return <div>{routerElements}</div>
}

export default App

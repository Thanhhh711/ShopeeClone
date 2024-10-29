import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from 'src/App'
import userEvent from '@testing-library/user-event'
import { QueryClient, setLogger } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppProvider, getInitialAppContext } from 'src/contexts/app.contexts'

export const delay = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },
      mutations: {
        retry: false
      }
    }
  })

  setLogger({
    log: console.log,
    warn: console.warn,
    // Suppress error logging
    error: () => null
  })

  const Provider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return Provider
}

const Provider = createWrapper()

export const renderWithRouter = ({ route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  const defaultValueAppContext = getInitialAppContext()
  return {
    user: userEvent.setup(),
    ...render(
      <Provider>
        <AppProvider defaultValue={defaultValueAppContext}>
          <App />
        </AppProvider>
      </Provider>,
      { wrapper: BrowserRouter }
    )
  }
}

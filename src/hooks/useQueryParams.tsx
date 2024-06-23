import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  //  thằng này giúp ta lấy đươc mấy cái query params trên url của chúng ta
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}

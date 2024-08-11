import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  //  thằng này giúp ta lấy đươc mấy cái query params trên url của chúng ta
  const [searchParams] = useSearchParams()

  // đọan này phân rả dữ liệu lấy từ params để lấy những thuôc tính

  /*
[...]searchParams: Sử dụng toán tử spread (...) để chuyển searchParams (một đối tượng URLSearchParams) thành một mảng các cặp [key, value].

Object.fromEntries(): Chuyển mảng các cặp [key, value] thành một đối tượng JavaScript, 
  trong đó các khóa là tên các tham số truy vấn và các giá trị là giá trị của các tham số truy vấn.
 
  */
  return Object.fromEntries([...searchParams])
}

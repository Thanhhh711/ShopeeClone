import useQueryParams from './useQueryParams'
import { isUndefined, omitBy } from 'lodash'
import { ProductListConfig } from 'src/types/product.type'

export type QueryConfig = {
  // cái này là định nghĩa các thuộc tính của ProductListConfig là dạng string
  [key in keyof ProductListConfig]: string
}

//  hàm này có tác dụng là loại bỏ thông tin bị undefine trên url hoặc truyền mã độc hại

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  //  đây là obj
  //  omitBy và isUndefined là gì?
  // nó được dùng để loại bỏ những thuộct tính
  //  dùng thằng này để giữ nguyên cái url tránh người dùng nhập bậy bạ

  //---------------------------
  // omitBy giúp loại bỏ những cái không mã độc hoặc cái nào bị undefind

  const queryConfig: QueryConfig = omitBy(
    {
      //  nó là string nha (dữ liệu lấy xuống)
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      // bắt đầu có thằng này sau khi am chức năng(nhập giá )
      category: queryParams.category

      //  nó là string nha (dữ liệu lấy xuống)
    },
    isUndefined
  )
  return queryConfig
}

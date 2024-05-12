import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import Product from './Product/Product'
import { omitBy, isUndefined } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import useQueryParams from 'src/hooks/useQueryParams'
import productApi from 'src/apis/product.api'

import { ProductListConfig } from 'src/types/product.type'
import Pagination from 'src/components/Pagination'
import categoryApi from 'src/apis/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParams()
  //  đây là obj
  //  omitBy và isUndefined là gì?
  // nó được dùng để loại bỏ những thuộct tính
  //  dùng thằng này để giữ nguyên cái url tránh người dùng nhập bậy bạ
  const queryConfig: QueryConfig = omitBy(
    {
      //  nó là string nha (dữ liệu lấy xuống)
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      category: queryParams.category

      //  nó là string nha (dữ liệu lấy xuống)
    },
    isUndefined
  )

  //  thằng này (queryKey )lắng nghe sự thanh đổi trên url
  //  thì sau đó nó sẽ gọi lại Api thì từ đó chúng ta được
  //  kết quả mới
  const { data: productData } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    //  thằng này giúp chúng ta giữ lai dữ liệu trước đó khi mà api gọi để cập nhật dữ liệu mới
    //  có nghĩa là ma chuyển trang: thì  thằng data sẽ bi set là undefined, điều này dẫn đến
    //  trang bị giật khi chuyển nên mình sẽ sử dụng thằng này để giữ lại data trước đó tránh bi giật
    keepPreviousData: true // hoặc false tùy theo yêu cầu của bạn

    //  thằng này
  })

  //------------------------------
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
    //  đâu có chuyển trang ha gì đâu mà cần keep
  })
  console.log('categoriesData', categoriesData)

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              {/*  đây là phần đánh giá  */}
              <AsideFilter
                //  tại sao mình truyền queryConfig
                //  do là mình chỉ muốn là lấy sản phẩm ra thôi chứ không muốn chuyển trang
                queryConfig={queryConfig}
                categories={categoriesData?.data.data || []}
              />
            </div>
            <div className='col-span-9'>
              {/*  đây là phần  sặp xếp sản phẩm  */}
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2  gap-3  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {/*  do mới vào Array là empty nên chúng ta cần phải fill(điền giá trị 0 cho tụi nó để lấy index) */}

                {productData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              {/* Phân trang */}
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

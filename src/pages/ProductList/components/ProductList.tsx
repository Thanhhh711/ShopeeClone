import { keepPreviousData, useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'

import categoryApi from 'src/apis/category.api'
import Pagination from 'src/components/Pagination'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import { Helmet } from 'react-helmet-async'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()

  //  thằng này (queryKey )lắng nghe sự thanh đổi trên url
  //  thì sau đó nó sẽ gọi lại Api thì từ đó chúng ta được
  //  kết quả mới
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    //  thằng này giúp chúng ta giữ lai dữ liệu trước đó khi mà api gọi để cập nhật dữ liệu mới
    //  có nghĩa là ma chuyển trang: thì  thằng data sẽ bi set là undefined, điều này dẫn đến
    //  trang bị giật khi chuyển nên mình sẽ sử dụng thằng này để giữ lại data trước đó tránh bi giật
    staleTime: 3 * 60 * 1000, // phải có thằng này thì( mới show được mấy sản phẩm tương ứng)
    placeholderData: keepPreviousData // hoặc false tùy theo yêu cầu của bạn
    //  thằng này
  })

  console.log('productData', productData)

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
      <Helmet>
        <title>Trang chủ| Shopee Clone</title>
        <meta name='description' content='Trang chủ dự án shoppee' />
      </Helmet>

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

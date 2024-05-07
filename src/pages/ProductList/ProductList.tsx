import React, { useState } from 'react'
import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import Product from './Product/Product'
import { useQuery } from '@tanstack/react-query'
import useQueryParams from 'src/hooks/useQueryParams'
import productApi from 'src/apis/product.api'
import Paginate from 'src/components/Pagination'

export default function ProductList() {
  const [page, setPage] = useState(1)
  const queryParams = useQueryParams()
  //  thằng này (queryKey )lắng nghe sự thanh đổi trên url
  //  thì sau đó nó sẽ gọi lại Api thì từ đó chúng ta được
  //  kết quả mới
  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryParams)
    }
  })
  console.log(data)

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            {/*  đây là phần đánh giá  */}
            <AsideFilter />
          </div>
          <div className='col-span-9'>
            {/*  đây là phần  sặp xếp sản phẩm  */}
            <SortProductList />
            <div className='mt-6 grid gird-cols-2  gap-3  md:grid-cols-3 lg:gird-cols-4 xl:gird-cols-5'>
              {/*  do mới vào Array là empty nên chúng ta cần phải fill(điền giá trị 0 cho tụi nó để lấy index) */}
              {data &&
                data.data.data.products.map((product) => (
                  <div
                    className='col-span-1'
                    key={product._id}
                  >
                    <Product product={product} />
                  </div>
                ))}
            </div>
            <Paginate
              page={page}
              setPage={setPage}
              pageSize={20}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

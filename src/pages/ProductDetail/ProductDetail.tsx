import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import React from 'react'
import { useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import InputNumber from 'src/components/InputNumber'
import ProductRating from 'src/components/ProductRating'
import { FormatNumberToSocialStyle, fomatCurrency, rateSale } from 'src/utils/util'

export default function ProductDetail() {
  const { id } = useParams()
  console.log(id)

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetailData?.data.data

  console.log(product)

  return (
    // có product thi mới hiên
    product && (
      <div className='bg-gray-200 py-6'>
        <div className='container'>
          <div className='bg-white p-4 shadow'>
            <div className='grid grid-cols-12 gap-9'>
              {/*  bên đây render ra hình */}
              <div className='col-span-5'>
                {/*  cái relative này giúp chúng ta canh chỉnh ản có chiều cao bằng với chiêu rộngk */}
                <div className='relative w-full pt-[100%] shadow'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='absolute top-0 left-0 bg-white w-full h-full object-cover'
                  />
                </div>

                {/*  render ra các hình nhỏ */}
                {/*  render ra mũi tên */}
                <div className='relative mt-4 grid grid-cols-5 gap-1'>
                  <button className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                    </svg>
                  </button>
                  {/*  trong cái list img của chúng ta có nhiều hình mà
                      nên là chúng ta chỉ muốn lấy 5 thằng đầu thôi, chúng ta dùng slice để lấy nhé
                  */}
                  {product.images.slice(0, 5).map((img, index) => {
                    const isActive = index === 0
                    return (
                      <div className='relative w-full pt-[100%]' key={img}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='absolute top-0 left-0 bg-white w-full h-full object-cover'
                        />
                        {/* */}
                        {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                      </div>
                    )
                  })}
                  <button className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                    </svg>
                  </button>
                </div>
              </div>
              {/*  bên đây render ra thông tin */}
              <div className='col-span-7'>
                <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
                <div className='mt-8 flex items-center'>
                  <div className='flex items-center'>
                    <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                    <ProductRating
                      rating={product.rating}
                      activeClassName='fill-orange text-orange h-4 w-4'
                      nonActiveClass='fill-gray-300 text-gray-300 h-4 w-4'
                    />
                  </div>
                  <div className='mx-4 h-4 w-[1px] bg-gray-300'>|</div>

                  <div className=''>
                    <span className='text-sm'>{FormatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1 text-gray-500 '>Đã bán</span>
                  </div>
                </div>
                <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                  <div className='text-gray-500 line-through'>đ{fomatCurrency(product.price_before_discount)}</div>
                  <div className='ml-3 text-3xl font-medium text-orange'>đ{fomatCurrency(product.price)}</div>
                  <div className='ml-4 bg-orange px-1 py-[2px] text-xs font-semibold'>
                    {rateSale(product.price_before_discount, product.price)} giảm
                  </div>
                </div>
                <div className='mt-8 flex items-center'>
                  <div className='capitaize text-gray-500'>số lượng</div>
                  <div className='ml-10 flex items-center'>
                    <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border-gray-300 text-gray-600'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                      </svg>
                    </button>
                    <InputNumber
                      value={1}
                      classNameInput='h-8 w-14 border-t border-b border-gray-300 p-l text-center outline-none'
                      classNameError='hidden'
                    />
                    <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border-gray-300 text-gray-600'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                      </svg>
                    </button>
                  </div>
                  <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
                </div>
                <div className='mt-8 flex items-center '>
                  <button className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'>
                    <img
                      alt='icon-add-to-cart'
                      className='_kL9Hf'
                      src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/0f3bf6e431b6694a9aac.svg'
                    />
                    <span className='text-center ml-2'>Thêm vào giỏ hàng</span>
                  </button>
                  <button className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm border border-orange bg-orange text-white px-12 capitalize shadow-sm hover:bg-orange/75'>
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 bg-white p-4 shadow'>
          <div className='container'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text slate-700'>Mô tả sản phẩm</div>

            <div className='mx-4 mt-4 mb-4 text-sm leading-loose'>
              {/* tập 1 (20(p45)) */}
              {/*  cài thêm thư viện DomPurity(2 phiên bản) */}
              {/*  DOMPurify đây là 1 thư viện để chống lại code html chứa js */}
              {/* dangerouslySetInnerHTML: thằng này giúp chứa code html  */}
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
            </div>
          </div>
        </div>
      </div>
    )
  )
}

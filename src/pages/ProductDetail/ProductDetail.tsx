import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'

import ProductRating from 'src/components/ProductRating'
import { ProductListConfig, Product as ProductType } from 'src/types/product.type'
import { FormatNumberToSocialStyle, fomatCurrency, getIdFromNameId, rateSale } from 'src/utils/util'
import Product from '../ProductList/components/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import path from 'src/constants/path'

export default function ProductDetail() {
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)

  const queryClient = useQueryClient()
  const [buyCount, setBuyCount] = useState(1)

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })

  console.log('productDetailData', productDetailData)
  // thằng này là chạy ảnh
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 4])

  // thằng này là con trỏ ne(chạy ảnh)
  const [activeImages, setActiveImages] = useState('')

  //  3 chấm ở dưới nó sẽ loại bỏ đi dấu []
  const product = productDetailData?.data.data

  // nay dom hinhf nha
  const imagesRef = useRef<HTMLImageElement>(null)
  //  tại sao dùng useMemo(hạn chế tính toán) là do chúng ta cũng currentIndexImages
  //  thằng nó bị set thì nó phải re-Render điều này thật sự không hay lắm
  //  nên chúng ta chơi kiểu này
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : ['']),
    [product, currentIndexImages]
  )

  console.log('product', product)

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }

  //  thằng này đùng để clone các sản phẩm cùng loai
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    // 3 phút
    //  Do thời gian của 2 lần query phải khác nhau
    //  nếu lần thứ nhất mà nó lớn hơn thằng thứ 2 (prouctList)
    // thì kiểu gì lấn thứ 2(prodductDetail(cơ chế catching)193) nó cũng phải gọi lại mặc dù có kết quả chưa
    staleTime: 3 * 60 * 1000,
    // khi mà product của chúng ta nó có data thì mới được gọi(193)
    enabled: Boolean(product)
  })

  const addToCartMutation = useMutation({ mutationFn: purchaseApi.addToCart })
  const navigate = useNavigate()

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImages(product.images[0])
    }
  }, [product])

  const next = () => {
    // 1 laf 5
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const chooceActive = (img: string) => {
    setActiveImages(img)
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // lấy possion nè
    const rect = event.currentTarget.getBoundingClientRect()

    const image = imagesRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    // muốn zoom được hình thì mình phải lấy được độ cao vs chiều dai ban đầu
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'

    // Event bubble(hình bị bắn) (189)
    // do đây là cái lỗi khi mà các sự kiện bị chồng lên nhau
  }

  const handleRemoveZoom = () => {
    imagesRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 1000 })
          // thằng invalidateQueries được xem là làm cho cái API lúc trc gọi nó không còn đúng
          // điều này dẫn đến sẽ fetch API 1 lần nữa
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const buyNow = async () => {
    // mutateAsync nó là mutation lun nha
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null

  return (
    // có product thi mới hiên

    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            {/*  bên đây render ra hình */}
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow  '
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImages}
                  alt={product.name}
                  className='absolute pointer-events-none top-0 left-0 h-full w-full bg-white object-cover'
                  ref={imagesRef}
                />
              </div>

              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImages
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooceActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
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

                <div>
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

                <QuantityController
                // onDecrease={handleBuyCount}
                // onIncrease={handleBuyCount}
                // onType={handleBuyCount}
                // value={buyCount} // Buy count được quản lý bởi cha của nó (Component ProductDetail)
                // max={product.quantity}
                />

                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center '>
                <button
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  onClick={addToCart}
                >
                  <img
                    alt='icon-add-to-cart'
                    className='_kL9Hf'
                    src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/0f3bf6e431b6694a9aac.svg'
                  />
                  <span className='text-center ml-2'>Thêm vào giỏ hàng</span>
                </button>

                <button
                  onClick={buyNow}
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm border border-orange bg-orange text-white px-12 capitalize shadow-sm hover:bg-orange/75'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        {/*  container cho nó ôm lại */}
        <div className='container'>
          <div className='mt-8 bg-white p-4 shadow'>
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

      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>Có thể bạn cũng thich</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-2  gap-3  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {/*  do mới vào Array là empty nên chúng ta cần phải fill(điền giá trị 0 cho tụi nó để lấy index) */}

              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
//  as được dùng ở đây tránh bị config với tên đã được sử dugnj
import { Product as ProductType } from 'src/types/product.type'
import {
  FormatNumberToSocialStyle,
  fomatCurrency
} from 'src/utils/util'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to='/'>
      <div className='bg-white shadow rounded-sm hover:translate-y-[-0.4rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-[100%] relative  '>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem]  line-clamp-2 text-xs'>
            {product.name}
          </div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-width-[50%] text-gray-500 truncate'>
              <span className='text-xs'>đ</span>
              {/*  đây là giá trước khuyến mãi */}
              <span>
                {fomatCurrency(
                  product.price_before_discount
                )}
              </span>
            </div>
            <div className='text-orange truncate ml-1'>
              <span className='text-xs'>đ</span>
              <span className='text-sm'>
                {fomatCurrency(product.price)}
              </span>
            </div>
          </div>

          <div className='mt-3 flex items-center justify-start'>
            {/*  ngôi sao */}
            <ProductRating rating={product.rating} />

            <div className='ml-5 flex justify-end'>
              <div className='mr-1 text-sm items-center justify-center flex'>
                Đã bán
              </div>

              <span className='text-sm'>
                {FormatNumberToSocialStyle(product.sold)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

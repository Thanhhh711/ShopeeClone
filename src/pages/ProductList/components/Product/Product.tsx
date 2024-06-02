import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
//  as được dùng ở đây tránh bị config với tên đã được sử dugnj
import { Product as ProductType } from 'src/types/product.type'
import { FormatNumberToSocialStyle, fomatCurrency, generateNameId } from 'src/utils/util'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='w-full pt-[100%] relative'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem]  line-clamp-2 text-xs'>{product.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-width-[50%] text-gray-500 truncate'>
              <span className='text-xs'>đ</span>
              {/*  đây là giá trước khuyến mãi */}
              <span>{fomatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='text-orange truncate ml-1'>
              <span className='text-xs'>đ</span>
              <span className='text-sm'>{fomatCurrency(product.price)}</span>
            </div>
          </div>

          <div className='mt-3 flex items-center justify-end'>
            {/*  ngôi sao */}
            <ProductRating rating={product.rating} />

            <div className='ml-2 text-sm'>
              <span className='text-sm'>{FormatNumberToSocialStyle(product.sold)}</span>
              <div className='ml-1 '>Đã bán</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

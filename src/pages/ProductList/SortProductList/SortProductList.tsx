import { sortBy } from 'src/constants/product'
import { QueryConfig } from '../ProductList'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import {
  Link,
  createSearchParams,
  useNavigate
} from 'react-router-dom'
import { order as orderConstant } from 'src/constants/product'
import path from 'src/constants/path'
import { omit } from 'lodash'
import { spawn } from 'child_process'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({
  queryConfig,
  pageSize
}: Props) {
  const page = Number(queryConfig.page)
  //  nếu như sort_by không có trong queryConfig này thì chúng ta
  //  sẽ sử dụng thằng createAt
  const { sort_by = sortBy.createdAt, order } = queryConfig

  const navigate = useNavigate()

  //  thằng sort-by có thể sẽ là undefined là do mình đã ? lúc mình định dạng
  //  nên mình dùng thằng exclude này nó giông như là 1 cái thư viện để ép kiểu
  // chúng ta truyền vào undefined thì nó sẽ không còn undefined
  const isActiveSortBy = (
    sortByValue: Exclude<
      ProductListConfig['sort_by'],
      undefined
    >
  ) => {
    return sort_by === sortByValue
  }

  const handleSort = (
    sortByValue: Exclude<
      ProductListConfig['sort_by'],
      undefined
    >
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        //  tại sao chúng ta phải sử dụng omit trong trường hợp này
        //  do là khi mà chúng ta bấm phổ biến thì nó phải sắp xếp từ
        // bán chạy nhất đến thấp nhất
        //  nhưng mà khi chúng ta chỉnh giá từ cao xuống thấp và ngược lại
        //  khi chúng ta chỉnh giá rồi mà còn bấm phổ biến thì nó sẽ search theo
        // giá chứ không phải theo lượt bán nên chúng ta phải loại nó
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (
    orderValue: Exclude<
      ProductListConfig['order'],
      undefined
    >
  ) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/50 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div className=''>Sắp xếp theo</div>
          <button
            className={classNames(
              'h-8 px-4 captilize text-sm  text-center',
              {
                'bg-orange text-white  hover:bg-orange/80':
                  isActiveSortBy(sortBy.view),
                'bg-white text-black  hover:bg-slate-100':
                  !isActiveSortBy(sortBy.view)
              }
            )}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames(
              'h-8 px-4 captilize text-sm  text-center  ',
              {
                'bg-orange text-white  hover:bg-orange/80':
                  isActiveSortBy(sortBy.createdAt),
                'bg-white text-black  hover:bg-slate-100':
                  !isActiveSortBy(sortBy.createdAt)
              }
            )}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames(
              'h-8 px-4 captilize text-sm  text-center',
              {
                'bg-orange text-white  hover:bg-orange/80':
                  isActiveSortBy(sortBy.sold),
                'bg-white text-black  hover:bg-slate-100':
                  !isActiveSortBy(sortBy.sold)
              }
            )}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy nhất
          </button>

          <select
            className={classNames(
              'h-8 px-4 capitalize text-sm  text-left outline-none',
              {
                'bg-orange text-white  hover:bg-orange/80':
                  isActiveSortBy(sortBy.price),
                'bg-white text-black  hover:bg-slate-100':
                  !isActiveSortBy(sortBy.price)
              }
            )}
            value={order || ''}
            onChange={(event) => {
              handlePriceOrder(
                //  tại sao minhf lại làm như z
                //  do là target của mình là string
                //  nhưng mà mình biết chắc kiểu dữ liệu giá trị của nó
                //  là 1 trong 2 thằng nên mình thằng này ép kiểu lun
                event.target.value as Exclude<
                  ProductListConfig['order'],
                  undefined
                >
              )
            }}
          >
            <option
              value=''
              disabled
              className='bg-white text-black'
            >
              Giá
            </option>
            <option
              value={orderConstant.asc}
              className='bg-white text-black'
            >
              Giá: thấp đến cao
            </option>
            <option
              value={orderConstant.desc}
              className='bg-white text-black'
            >
              Giá: cao đến thấp
            </option>
          </select>
        </div>

        <div className=' flex items-center'>
          <div className=''>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex justify-center items-center w- 9 px-3 h-8 rounded-tl-sm ronded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5 8.25 12l7.5-7.5'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex justify-center items-center w- 9 px-3 h-8 rounded-tl-sm ronded-bl-sm bg-white/60 hover:bg-slate-100 '
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5 8.25 12l7.5-7.5'
                  />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='flex justify-center items-center w- 9 px-3 h-8 rounded-tl-sm ronded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5 8.25 12l7.5-7.5'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex justify-center items-center w- 9 px-3 h-8 rounded-tl-sm ronded-bl-sm bg-white/60 hover:bg-slate-100  '
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m8.25 4.5 7.5 7.5-7.5 7.5'
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

//  phút 20

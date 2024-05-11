import {
  Link,
  createSearchParams,
  useNavigate
} from 'react-router-dom'
import Button from 'src/components/Button'

import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { QueryConfig } from '../ProductList'
import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/types/utils.type'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

// lấy ra sử dụng nè
type FormData = NoUndefinedField<
  Pick<Schema, 'price_max' | 'price_min'>
>

//  phút 37 (185)

/**
 *  Rule validate
 * giá price max phải lớn hơn hoặc bằng vs min price
 * còn không thì có price_min thì kh có price max và ngược lại
 * */

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({
  queryConfig,
  categories
}: Props) {
  //  dùng react.hookform nó chỉ validate cái input mà chúng ta nhập thôi
  const { category } = queryConfig
  //  tại sao dùng useForm do mình đâu có lấy từ thằng register đâu
  //  nên mình phải dùng thằng useForm để quản lý
  const {
    control,
    handleSubmit,
    trigger, // trigger này giúp chúng ta sử lý validate
    formState: { errors }
  } = useForm<FormData>({
    // chúng ta nên set cái defaultValues
    // để tránh bị undefined khi khởi tạo như z thì nó không hay
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    //  việc dùng thằng này giúp ta focus vào price max thui(Được muốn z 185 )
    shouldFocusError: false // mún sử dụng thằng forcus này thì bắt buộc sử dụng ref
    //  mà thằng này mặc định là true
  })

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    console.log(data)

    navigate({
      pathname: path.profile,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  return (
    <div className='py-4'>
      <Link
        to={path.profile}
        className={classNames(
          'flex items-center font-bold',
          { 'text-orange': !category }
        )}
      >
        <svg
          viewBox='0 0 12 10'
          className='mr-3 h-4 w-3 fill-current'
        >
          <g
            fillRule='evenodd'
            stroke='none'
            strokeWidth={1}
          >
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      {/*  cái gạch ngang  */}
      <div className='bg-gray-300 h-[1px] my-4' />
      <ul>
        {categories.map((categoryItem) => {
          // có id thì
          const isActive = category === categoryItem._id
          return (
            <li
              className='py-2 pl-2'
              key={categoryItem._id}
            >
              {/*  mũi tên */}
              <Link
                to={{
                  pathname: path.profile,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2 ', {
                  'text-orange font-semibold': isActive
                })}
              >
                {isActive && (
                  <svg
                    viewBox='0 0 4 7'
                    className='fill-orange h-2 w-2 absolute top-1 left-[-10px]'
                  >
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        to={path.profile}
        className='flex items-center font-bold mt-4 uppercase'
      >
        <svg
          enable-background='new 0 0 15 15'
          viewBox='0 0 15 15'
          x='0'
          y='0'
          className='mt-3 h-4 fill-current stroke-current mr-3'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-miterlimit='10'
            ></polyline>
          </g>
        </svg>
        Bộ lọc tìm kíếm
      </Link>
      {/*  đây là đường kẻ ngang */}
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='my-5'>
        <div>Khoảng giá </div>

        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              //  filed là đối tương chứa thông tin ma đến trường dữ liệu Controller đang điều kiển
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    name='form'
                    placeholer='Đ-từ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
                    //  do là cái onChange này nó chúng ta qui định nó xuất ra event
                    // onChange={(event) =>
                    //   field.onChange(event)
                    onChange={(event) => {
                      field.onChange(event)
                      // nếu chúng ta dùng trigger kiểu này
                      // trigger() // thì nó sẽ validate hết cái form của chúng ta
                      //
                      trigger('price_max') // z là nó chỉ validate đến thằng pricemaxx
                    }}
                    // là giá trị của chúng ta khi mà nhập vào
                    value={field.value}
                    // do chúng ta đã chuyển qua dungf ref nên chúng ta dễ dàng forcus vào lỗi (185)
                    ref={field.ref}
                    classNameError='hidden' // do mún hiện lổi
                  />
                )
              }}
            />

            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>
              {errors.price_min?.message}
            </div>

            <div className='mx-2 mt-2 shrink-0 text-color-gray'>
              --
            </div>

            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    name='form'
                    placeholer='Đ-đến'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
                    //  do là cái onChange này nó chúng ta qui định nó xuất ra event
                    // onChange={(event) =>
                    //   field.onChange(event)
                    onChange={(event) => {
                      field.onChange(event)
                      // nếu chúng ta dùng trigger kiểu này
                      // trigger() // thì nó sẽ validate hết cái form của chúng ta
                      //
                      trigger('price_min') // z là nó chỉ validate đến thằng pricemin
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>
          <Button className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'>
            Áp dụng
          </Button>
        </form>
      </div>

      <div className='text-sm'>Đánh giá </div>

      <ul className='my-3 flex-warp'>
        <Link to='' className='flex  items-center text-sm'>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <svg
                viewBox='0 0 9.5 8'
                className='w-4 h-4 mr-1'
                key={index}
              >
                <defs>
                  <linearGradient
                    id='ratingStarGradient'
                    x1='50%'
                    x2='50%'
                    y1='0%'
                    y2='100%'
                  >
                    <stop offset={0} stopColor='#ffca11' />
                    <stop offset={1} stopColor='#ffad27' />
                  </linearGradient>
                  <polygon
                    id='ratingStar'
                    points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                  />
                </defs>
                <g
                  fill='url(#ratingStarGradient)'
                  fillRule='evenodd'
                  stroke='none'
                  strokeWidth={1}
                >
                  <g transform='translate(-876 -1270)'>
                    <g transform='translate(155 992)'>
                      <g transform='translate(600 29)'>
                        <g transform='translate(10 239)'>
                          <g transform='translate(101 10)'>
                            <use
                              stroke='#ffa727'
                              strokeWidth='.5'
                              xlinkHref='#ratingStar'
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            ))}
          <span>Trở lên </span>
        </Link>
        <Link to='' className='flex  items-center text-sm'>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <svg
                viewBox='0 0 9.5 8'
                className='w-4 h-4 mr-1'
                key={index}
              >
                <defs>
                  <linearGradient
                    id='ratingStarGradient'
                    x1='50%'
                    x2='50%'
                    y1='0%'
                    y2='100%'
                  >
                    <stop offset={0} stopColor='#ffca11' />
                    <stop offset={1} stopColor='#ffad27' />
                  </linearGradient>
                  <polygon
                    id='ratingStar'
                    points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                  />
                </defs>
                <g
                  fill='url(#ratingStarGradient)'
                  fillRule='evenodd'
                  stroke='none'
                  strokeWidth={1}
                >
                  <g transform='translate(-876 -1270)'>
                    <g transform='translate(155 992)'>
                      <g transform='translate(600 29)'>
                        <g transform='translate(10 239)'>
                          <g transform='translate(101 10)'>
                            <use
                              stroke='#ffa727'
                              strokeWidth='.5'
                              xlinkHref='#ratingStar'
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            ))}
          <span>Trở lên </span>
        </Link>
      </ul>
      <div className='bg-gray-300 h-[1px] my-4' />
      <Button className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'>
        Xóa tất cả
      </Button>
    </div>
  )
}

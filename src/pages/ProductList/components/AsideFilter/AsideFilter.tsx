import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'

import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { omit } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import InputNumber from 'src/components/InputNumber'
import InputV2 from 'src/components/InputV2'
import path from 'src/constants/path'
import RatingStart from 'src/pages/RatingStart'
import { Category } from 'src/types/category.type'
import { NoUndefinedField } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rules'
import { QueryConfig } from '../ProductList'
import { ObjectSchema } from 'yup'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

// lấy ra sử dụng nè
type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

//  phút 37 (185)

/**
 *  Rule validate
 * giá price max phải lớn hơn hoặc bằng vs min price
 * còn không thì có price_min thì kh có price max và ngược lại
 * */

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ queryConfig, categories }: Props) {
  //  dùng react.hookform nó chỉ validate cái input mà chúng ta nhập thôi
  const { category } = queryConfig
  //  tại sao dùng useForm do mình đâu có lấy từ thằng register đâu
  //  nên mình phải dùng thằng useForm để quản lý
  const {
    control,
    handleSubmit,
    trigger, // trigger này giúp chúng ta sử lý validate
    reset,
    formState: { errors }
  } = useForm<FormData>({
    // chúng ta nên set cái defaultValues
    // để tránh bị undefined khi khởi tạo như z thì nó không hay
    defaultValues: {
      price_min: '',
      price_max: ''
    },

    //yupResoler làm hàm của react hook form
    // kiểu dữ liệu được sử dụng trong schema là kiểu FormData
    // (priceSchema as ObjectSchema<FormData>): Trong TypeScript, bạn cần xác định kiểu dữ liệu cho schema khi sử dụng nó với yupResolver.
    // Trong trường hợp này, bạn đã ép kiểu priceSchema thành ObjectSchema<FormData>, nơi FormData là kiểu dữ liệu của schema.
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>)
    //  việc dùng thằng này giúp ta focus vào price max thui(Được muốn z 185 )
    //    shouldFocusError: false // mún sử dụng thằng forcus này thì bắt buộc sử dụng ref
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

  const handleRemoveAll = () => {
    reset()

    navigate({
      pathname: path.profile,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link to={path.profile} className={classNames('flex items-center font-bold', { 'text-orange': !category })}>
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
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
          const isActive = category === categoryItem._id
          console.log(category)

          console.log(isActive)

          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.profile,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <Link to={path.profile} className='flex items-center font-bold mt-4 uppercase'>
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
            />
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
            {/* <Controller
              control={control}
              name='price_min'
              //  filed là đối tương chứa thông tin ma đến trường dữ liệu Controller đang điều kiển
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholer='Đ-từ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
                    classNameError='hidden' // do mún hiện lổi
                    //  do là cái onChange này nó chúng ta qui định nó xuất ra event
                    // onChange={(event) =>
                    //   field.onChange(event)
                    {...field}
                    // value={field.value}
                    // ref={field.ref}
                    onChange={(event) => {
                      field.onChange(event)
                      // nếu chúng ta dùng trigger kiểu này
                      // trigger() // thì nó sẽ validate hết cái form của chúng ta
                      //
                      trigger('price_max') // z là nó chỉ validate đến thằng pricemaxx
                    }}
                    // là giá trị của chúng ta khi mà nhập vào
                    // value={field.value}
                    // // do chúng ta đã chuyển qua dungf ref nên chúng ta dễ dàng forcus vào lỗi (185)
                    // ref={field.ref}
                  />
                )
              }}
            /> */}

            <InputV2
              // bắt buộc sử dụng V2 phải truyền control của ReactHookForm vào
              // control lấy đâu ra từ react hook Form
              control={control}
              type='number'
              className='grow'
              placeholder='Đ-từ '
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
              classNameError='hidden'
              name='price_min'
              onChange={() => {
                // nếu chúng ta dùng trigger kiểu này
                // trigger() // thì nó sẽ validate hết cái form của chúng ta
                //
                trigger('price_max') // z là nó chỉ validate đến thằng pricemaxx
              }}
            />

            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>{errors.price_min?.message}</div>

            <div className='mx-2 mt-2 shrink-0 text-gray-300'>--</div>

            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholer='Đ-đến'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shawdow-sm rounded-sm'
                    //  do là cái onChange này nó chúng ta qui định nó xuất ra event
                    // onChange={(event) =>
                    //   field.onChange(event)
                    {...field}
                    // value={field.value}
                    // ref={field.ref}
                    onChange={(event) => {
                      field.onChange(event)
                      // nếu chúng ta dùng trigger kiểu này
                      // trigger() // thì nó sẽ validate hết cái form của chúng ta
                      //
                      trigger('price_min') // z là nó chỉ validate đến thằng pricemin
                    }}
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

      <RatingStart queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4' />

      <div
        onClick={handleRemoveAll}
        className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'
        role='button'
        aria-hidden='true'
      >
        Xóa tất cả
      </div>
    </div>
  )
}

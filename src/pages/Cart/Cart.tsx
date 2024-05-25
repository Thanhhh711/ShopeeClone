import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { fomatCurrency, generateNameId } from 'src/utils/util'
interface ExtendedPurchases extends Purchase {
  disabled: boolean
  checked: boolean
}

export default function Cart() {
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>([])

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  useEffect(() => {
    setExtendedPurchases(
      purchasesInCart?.map((purchase) => ({
        ...purchase,
        disabled: false,
        checked: false
      })) || []
    )
  }, [purchasesInCart])

  const handleChecked = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[100px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-orange'
                      checked={isAllChecked}
                      onClick={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm bg-white p-5 shadow'>
              {extendedPurchases.map((purchase, index) => (
                <div
                  key={purchase._id}
                  className=' mb-5 grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0 '
                >
                  <div className='col-span-6'>
                    {/*flex cho nó dàng hàng ngan */}
                    <div className='flex'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orangege'
                          checked={purchase.checked}
                          onChange={handleChecked(index)}
                        />
                        `
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                            className='h-20 w-20 flex-shrink-0'
                          >
                            <img alt={purchase.product.name} src={purchase.product.image} />
                          </Link>
                          <div className='flex-grow px-2 pt-1 pb-2'>
                            <Link
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              className='line-clamp-2'
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 items-center'>
                      <div className='col-span-2'>
                        <div className='flex itmes-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            đ {fomatCurrency(purchase.product.price_before_discount)}
                          </span>
                          <span className='ml-3'>đ {fomatCurrency(purchase.product.price)}</span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          className='flex items-center'
                        />
                      </div>
                      <div className='cols-span-1'>
                        <span className='text-orange'>
                          đ {fomatCurrency(purchase.buy_count * purchase.product.price)}
                        </span>
                      </div>
                      <div className='col-span-1'>
                        <button className='bg-none text-black transition-colors hover:text-orange'>Xóa</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input type='checkbox' className='h-5 w-5 accent-orange' onClick={handleCheckAll} />
            </div>
            <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedPurchases.length})</button>
            <button className='mx-3 border-none bg-none'>Xóa</button>
          </div>
          <div className='ml-auto flex flex-col items-center mt-5 sm:flex-row sm:mt-0 sm:items-center'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <div>Tổng thanh toán (0 sản phẩm) </div>
                <div className='ml-2 text-2xl text-orange'>đ138000</div>
              </div>
              <div className='flex items-center sm:justify-end text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-orange'>đ138000</div>
              </div>
            </div>
            <Button className=' ml-4 mt-5 sm:mt-0 flex  h-10 w-52 justify-center items-center  text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600  '>
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

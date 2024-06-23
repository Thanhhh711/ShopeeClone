import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import noProduct from 'src/assets/images/no-product.png'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.contexts'
import { Purchase } from 'src/types/purchase.type'
import { fomatCurrency, generateNameId } from 'src/utils/util'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch() // việc refresh có thể giúp mình đổi disable sau khi chúng ta fetch API thành công
    }
  })

  const buyProdcutsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch() // việc refresh có thể giúp mình đổi disable sau khi chúng ta fetch API thành công
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const deleteProdcutsMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch() // việc refresh có thể giúp mình đổi disable sau khi chúng ta fetch API thành công
    }
  })

  const location = useLocation()
  // do là thằng location này nó có thể là kiểu gì cũng được
  // nên mình phải định dạng kiểu dữ liệu cho nó tường mình

  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  console.log(location.state)

  const purchasesInCart = purchasesInCartData?.data.data

  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])

  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = extendedPurchases.length

  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      console.log('prev', prev)

      // thằng keyBy này giúp lấy _id ra ngoài làm key
      // ví dụ
      //const prev = [
      //   { _id: '123', name: 'Item 1', price: 10 },
      //   { _id: '456', name: 'Item 2', price: 20 },
      //   { _id: '789', name: 'Item 3', price: 30 }
      // ];

      /*
            const extendPurchasesObject = {
    '123': { _id: '123', name: 'Item 1', price: 10 },
    '456': { _id: '456', name: 'Item 2', price: 20 },
    '789': { _id: '789', name: 'Item 3', price: 30 }
  };
        */
      const extendPurchasesObject = keyBy(prev, '_id')
      console.log(extendPurchasesObject)

      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseLocation = choosenPurchaseIdFromLocation === purchase._id

          return {
            ...purchase,
            disabled: false,
            // Boolean này giúp check xem đối tượng đó có đang checked không nếu có thì true, kh thì false
            // có thì true
            checked: isChoosenPurchaseLocation || Boolean(extendPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      //history nó giống như là localStroge vậy á
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
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

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        // khi mà đang gọi API thì mình không cho người dùng ngta thao tác
        //  đợi mình gọi xong rồi mình mới cho thao tác
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          // khi mà đang gọi API thì mình không cho người dùng ngta thao tác
          //  đợi mình gọi xong rồi mình mới cho thao tác
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  //  delete 1 items
  const handleDelete = (purchasesIndex: number) => () => {
    const purchaseId = extendedPurchases[purchasesIndex]._id
    deleteProdcutsMutation.mutate([purchaseId])
  }

  //  delete many items
  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    //  do bản thân nó đã là array rồi
    deleteProdcutsMutation.mutate(purchaseIds)
  }

  // mua nè
  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase._id,
        buy_count: purchase.buy_count
      }))
      buyProdcutsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
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
                {/*  có mới hiện cái khuông */}
                {extendedPurchases.length > 0 && (
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
                                  className='h-20 w-20 flex-shrink-0 text-left'
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
                                classNameWrapper='flex items-center'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className='cols-span-1'>
                              <span className='text-orange'>
                                đ {fomatCurrency(purchase.buy_count * purchase.product.price)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                className='bg-none text-black transition-colors hover:text-orange'
                                onClick={handleDelete(index)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input type='checkbox' className='h-5 w-5 accent-orange' onClick={handleCheckAll} />
                </div>
                <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedPurchases.length})</button>

                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
                  Xóa
                </button>
              </div>
              <div className='ml-auto flex flex-col items-center mt-5 sm:flex-row sm:mt-0 sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm) </div>
                    <div className='ml-2 text-2xl text-orange'>đ{fomatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>

                  <div className='flex items-center sm:justify-end text-sm'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>đ{fomatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  className=' ml-4 mt-5 sm:mt-0 flex  h-10 w-52 justify-center items-center  text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600  '
                  onClick={handleBuyPurchases}
                  // để tránh ngta ấn liên tuchj
                  disabled={buyProdcutsMutation.isPending}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            {/*  do nó là block nên mình kh cần div chỉ cần dùng mx-auto */}
            {/* nêú là innier block thì sử dụng thẻ div */}
            <img src={noProduct} alt='no purchase' className='h-24  w-24 mx-auto' />

            <div className='font-bold text-gray-400 mt-5'>Giỏ hàng của bạn còn trống</div>
            <div className='mt-5 text-center'>
              <Link
                to={path.home}
                className='mt-5 bg-orange  rounded-sm px-10  hover:bg-orange/80 transition-all py-2 uppercase text-white'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

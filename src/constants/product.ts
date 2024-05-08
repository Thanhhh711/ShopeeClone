export const sortBy = {
  createdAt: 'createdAt',
  view: 'view',
  sold: 'sold',
  price: 'price'
} as const

export const order = {
  asc: 'asc',
  desc: 'desc'
} as const

//  việc mà chúng ta as const chỗ này nó giúp chúng ta tránh rõ sai
//  và nó chỉ cho readOnly thui

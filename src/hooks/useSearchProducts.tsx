import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import useQueryConfig from './useQueryConfig'

import { omit } from 'lodash'
import { schema, Schema } from 'src/utils/rules'

//  lấy cái yup ra nè
type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])
export default function useSearchProducts() {
  // thằng đầu tiên là 1 obj search clean
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const onSubmitSearch = handleSubmit((data) => {
    // config này là gì?
    // obj clean trỏ vào thuộc tính order có sẵn bên trong hỏi
    // có sort hong có sort thì loại bỏ cái 2 thuộc tính và loại nó ra
    // tránh bị mất đi cái trạng thái sort trc đó
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(
        //  tại sao chúng ta phải sử dụng omit trong trường hợp này
        //  do là khi mà chúng ta bấm phổ biến thì nó phải sắp xếp từ
        // bán chạy nhất đến thấp nhất
        //  nhưng mà khi chúng ta chỉnh giá từ cao xuống thấp và ngược lại
        //  khi chúng ta chỉnh giá rồi mà còn bấm phổ biến thì nó sẽ search theo
        // giá chứ không phải theo lượt bán nên chúng ta phải loại nó
        config
      ).toString()
    })
  })

  return { onSubmitSearch, register }
}

import { InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form'
//  185
export type InputNumberProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  classNameInput?: string
  classNameError?: string
} & InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<TFieldValues, TName>

export function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: InputNumberProps<TFieldValues, TName>) {
  const {
    type,
    onChange,
    placeholder,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 forcus:border-gray-500 forcus:shawdow-sm rounded-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    value = '',
    ...rest
  } = props

  // cái field này xuất ra cho chúng ta cái Value á
  const { field, fieldState } = useController(props)
  // khi giá trị khởi tạo bị thay đổi thì cái local Value cũn kh bị thay đổi
  // 1 chút thay đổi này chóng luôn nhập kí tự
  //  nó chỉ bị thay đổi ở lần đầu tiên khởi tạo thui
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value

    const numberCondition =
      type === 'number' &&
      //  đây là cách test về kiểm tra số
      (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      // cập nhật localValue State
      setLocalValue(valueFromInput)
      // Gọi filed.OnCHange để cập nhật state React Hook From
      field.onChange(event)

      //  Thục thi onChange callBack từ bên ngoài truyền vào props
      //  có nghĩa là khi người dùng truyền vào số thì onChange mới chạy
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input
        className={classNameInput}
        {...rest}
        {...field}
        placeholder={placeholder}
        onChange={handleChange}
        value={value || localValue}
      />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

//  taị sao mình không extends thằng input cho đỡ phải code
//  do là mình sẽ phải handle lại 1 số thứ nên thật sự không cần phải làm  như z

//----------------------------

// type Gen<TFunc> = {
//   getName: TFunc
// }

// function Hexa<TFunc extends () => string, TLastName extends ReturnType<TFunc>>(props: {
//   person: Gen<TFunc>
//   lastName: TLastName
// }) {
//   return null
// }

// const handleName: () => 'Duoc' = () => 'Duoc'

// function App() {
//   return <Hexa person={{ getName: handleName }} lastName='Duoc' />
// }

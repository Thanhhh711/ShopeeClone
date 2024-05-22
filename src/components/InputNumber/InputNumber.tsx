import { InputHTMLAttributes, forwardRef, useState } from 'react'
//  185
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  placeholer?: string
}

//  do là mih không cần extends Input này
//  do là mìn hong có nhận thẳng props register
//  nên la mình hong cần lắm
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    placeholer,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 forcus:border-gray-500 forcus:shawdow-sm rounded-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  // khi giá trị khởi tạo bị thay đổi thì cái local Value cũn kh bị thay đổi
  // 1 chút thay đổi này chóng luôn nhập kí tự
  //  nó chỉ bị thay đổi ở lần đầu tiên khởi tạo thui
  const [localValue, setLocalValue] = useState<string>(value as string)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    //  đây là cách test về kiểm tra số
    if (/^\d+$/.test(value) || value === '') {
      //  Thục thi onChange callBack từ bên ngoài truyền vào props
      //  có nghĩa là khi người dùng truyền vào số thì onChange mới chạy
      onChange && onChange(event)
      // cập nhật localValue State
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input
        placeholder={placeholer}
        //  tại sao bị như z
        // nó bị overwritte
        // name='email'
        className={classNameInput}
        {...rest}
        onChange={handleChange}
        value={value || localValue}
        ref={ref}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

//  taị sao mình không extends thằng input cho đỡ phải code
//  do là mình sẽ phải handle lại 1 số thứ nên thật sự không cần phải làm  như z

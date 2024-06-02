import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  placeholer?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  errorMessage,
  className,
  name,
  rules,
  register,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 forcus:shawdow-sm rounded-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',

  placeholder,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input
        //  tại sao bị như z
        // nó bị overwritte
        // name='email'
        className={classNameInput}
        {...registerResult}
        {...rest}
        placeholder={placeholder}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

import { InputHTMLAttributes } from 'react'
import type {
  RegisterOptions,
  UseFormRegister
} from 'react-hook-form'

interface Props
  extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  placeholer?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  type,
  errorMessage,
  placeholer,
  className,
  autoComplete,
  name,
  rules,
  register,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 forcus:border-gray-500 forcus:shawdow-sm rounded-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm'
}: Props) {
  const registerResult =
    register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input
        type={type}
        //  tại sao bị như z
        // nó bị overwritte
        // name='email'
        className={classNameInput}
        placeholder={placeholer}
        autoComplete={autoComplete}
        {...registerResult}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

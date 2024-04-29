import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholer?: string
  className?: string
  name: string
  register: UseFormRegister<any>
  rules?: RegisterOptions
  autoComplete?: string
}
export default function Input({
  type,
  errorMessage,
  name,
  register,
  autoComplete,
  className,
  placeholer,
  rules
}: Props) {
  return (
    <div className={className}>
      <input
        type={type}
        //  tại sao bị như z
        // nó bị overwritte
        // name='email'
        className='p-3 w-full outline-none border border-gray-300 forcus:border-gray-500 forcus:shawdow-sm rounded-sm'
        placeholder={placeholer}
        autoComplete={autoComplete}
        {...register(name, rules)}
      />
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
    </div>
  )
}

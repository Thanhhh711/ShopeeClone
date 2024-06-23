import React, { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange?: (file?: File) => void
}
export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // const [file, setFile] = useState<File>()

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // này là 1 cái file list mà chúng ta lấy thì chỉ lấy có 1 file thôi nên là items (0)
    const fileformLocal = event.target.files?.[0]
    if (fileformLocal && (fileformLocal?.size >= config.maxSizeUpLoadAvatar || !fileformLocal.type.includes('image'))) {
      toast.error('Vui lòng chọn ảnh có dung lượng nhỏ hơn 1MB và phải là ảnh', {
        position: 'top-center'
      })
      return
    }
    onChange && onChange(fileformLocal)
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <Fragment>
        <input
          className='hidden'
          type='file'
          accept='jpg,.jeg,.png'
          ref={fileInputRef}
          onChange={onFileChange}
          onClick={(event) => {
            ;(event.target as any).value = null
          }}
        />
        <button
          onClick={handleUpload}
          type='button'
          className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        >
          Chọn ảnh
        </button>
      </Fragment>
    </div>
  )
}

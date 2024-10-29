import { AxiosError, isAxiosError } from 'axios'
import { describe, expect, it } from 'vitest'
import { isAxiosUnprocessableEntityError } from '../util'
import { HttpStatusCode } from 'src/constants/HttpStatusCode.enum'

// describe được dùng để tập hợp mô tả các ngữ cảnh cần test: ví dụ function, component
// hoặc 1 đơn vị cần test
describe('isAxiosError', () => {
  // it được dùng để ghi chú trường hợp cần test
  it('isAxiosError trả về boolean', () => {
    // expect dùng để mong đợi giá trị trả về
    expect(isAxiosError(new Error())).toBe(false) // nếu mà function nhận vào lỗi thường thì false
    expect(isAxiosError(new AxiosError())).toBe(true) // đúng nè
  })
})

describe('isAxiosUnprocessableEntityError', () => {
  it('isAxiosUnprocessableEntityError trả về boolean', () => {
    expect(isAxiosUnprocessableEntityError(new Error())).toBe(false)
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError, // 500
          data: null
        } as any)
      )
    ).toBe(false) // đúng nè
    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity, // 422
          data: null
        } as any)
      )
    ).toBe(true) // đúng nè
  })
})

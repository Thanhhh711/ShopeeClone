import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearLS,
  getAccessTokenFormLS,
  getRefreshTokenFormLS,
  saveAccessTokenToLS,
  saveRefreshTokenToLS
} from '../auth'

const accessToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWMxNGYyYmI2NTk3MDMzNjYxMDNiZSIsImVtYWlsIjoidGhhbmghQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjQtMDgtMTFUMDU6NTc6NDkuMDM4WiIsImlhdCI6MTcyMzM1NTg2OSwiZXhwIjoxNzIzNDQyMjY5fQ.F3Dkf6E3guJLaFO76S57aheYDBxoUrVKVPX1JZVa9A0'

const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWMxNGYyYmI2NTk3MDMzNjYxMDNiZSIsImVtYWlsIjoidGhhbmghQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjQtMDgtMTFUMDU6NTc6NDkuMDM4WiIsImlhdCI6MTcyMzM1NTg2OSwiZXhwIjoxNzM3MTc5ODY5fQ.7sxfQkuP3oN660NvE-rp_WhT7Jr9fa40JX6AFt2R7EM'

const profile =
  '{"_id":"665c14f2bb659703366103be","roles":["User"],"email":"thanh!@gmail.com","createdAt":"2024-06-02T06:45:06.201Z","updatedAt":"2024-06-06T08:30:23.664Z","__v":0,"address":"326/9 đường Trần Hưng Đạo","date_of_birth":"2003-11-06T17:00:00.000Z","name":"Ngô Quang Phước Thành","phone":"0327315344","avatar":"28fd214c-a0de-41f3-b5f8-0d72e6c52828.png"}'

// này là refresh mỗi lần được req
beforeEach(() => {
  localStorage.clear()
})

describe('saveAccessTokenToLS', () => {
  it('saveAccessTokenToLS phải được set vào LS', () => {
    saveAccessTokenToLS(accessToken)
    expect(localStorage.getItem('access_token')).toBe(accessToken)
  })
})

describe('saveRefreshTokenToLS', () => {
  it('saveRefreshTokenToLS phải được set vào LS', () => {
    saveRefreshTokenToLS(refreshToken)

    // toEqual vs toBE là giống nhau
    // nhưng mà toEqual ngon hơn
    // tại vì toEqual có thể check luôn cả phải có cùng tham chiếu không
    // vì mặc dù 2 obj cùng value nhưng chưa chắc cùng tham chiếu
    expect(localStorage.getItem('refresh_token')).toEqual(refreshToken)
  })
})

describe('clearLS', () => {
  it('Xóa hết access_token, refresh_token, profile', () => {
    saveRefreshTokenToLS(refreshToken)
    saveAccessTokenToLS(accessToken)
    // setProfile tại đây
    // ...
    clearLS()
    expect(getAccessTokenFormLS()).toBe('')
    expect(getRefreshTokenFormLS()).toBe('')
  })
})

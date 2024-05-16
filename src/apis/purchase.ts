import { PurchaseListStatus } from './../types/purchase.type'
import { Purchase } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'purchases'

export const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, JSON.stringify(body))
  },

  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase>>(`${URL}/get-purchases`, { params })
  }
}

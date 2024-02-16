import { request } from '@/utils'

const storeApi = {
  // 查詢餐廳
  findStore: (params) => {
    return request.post('/Store/Find', params)
  },
}

export default storeApi

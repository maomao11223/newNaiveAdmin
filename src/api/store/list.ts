import { http } from '@/utils/http/axios';

//获取table
export function findApi(params) {
  return http.request({
    url: '/Store/Find',
    method: 'post',
    params,
  });
}

export function deleteApi(params) {
  return http.request(
    {
      url: '/Store/Delete',
      method: 'post',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

export function addApi(params) {
  return http.request({
    url: '/Store/Add',
    method: 'post',
    params,
  });
}

export function updateApi(params) {
  return http.request({
    url: '/Store/Update',
    method: 'post',
    params,
  });
}

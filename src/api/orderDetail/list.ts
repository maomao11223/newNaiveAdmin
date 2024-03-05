import { http } from "@/utils/http/axios";

//获取table
export function findApi(params) {
  return http.request({
    url: "/OrderDetail/Find",
    method: "post",
    params,
  });
}

export function deleteApi(params) {
  return http.request(
    {
      url: "/OrderDetail/Delete",
      method: "post",
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

export function addApi(params) {
  return http.request({
    url: "/OrderDetail/Add",
    method: "post",
    params,
  });
}

export function updateApi(params) {
  return http.request({
    url: "/OrderDetail/Update",
    method: "post",
    params,
  });
}

import { http } from "@/utils/http/axios";

//获取table
export function findApi(params) {
  return http.request({
    url: "/Order/Find",
    method: "post",
    params,
  });
}

export function deleteApi(params) {
  return http.request(
    {
      url: "/Order/Delete",
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
    url: "/Order/Add",
    method: "post",
    params,
  });
}

export function updateApi(params) {
  return http.request({
    url: "/Order/Update",
    method: "post",
    params,
  });
}

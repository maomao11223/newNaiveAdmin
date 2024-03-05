import { http } from "@/utils/http/axios";

//获取table
export function findApi(params) {
  return http.request({
    url: "/Menu/Find",
    method: "post",
    params,
  });
}

export function deleteApi(params) {
  return http.request(
    {
      url: "/Menu/Delete",
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
    url: "/Menu/Add",
    method: "post",
    params,
  });
}

export function updateApi(params) {
  return http.request({
    url: "/Menu/Update",
    method: "post",
    params,
  });
}
export function downloadApi(params) {
  return http.request(
    {
      url: "/Menu/Download",
      method: "post",
      params,
      responseType: "blob",
    },
    {
      isTransformResponse: false,
    }
  );
}
export function uploadApi(params) {
  return http.uploadFile(
    {
      url: "/Menu/Upload",
      method: "post",
    },
    params
  );
}

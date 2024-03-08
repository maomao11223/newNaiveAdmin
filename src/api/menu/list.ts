import { http } from "@/utils/http/axios";
import { getAppEnvConfig } from "@/utils/env";

const { VITE_GLOB_API_URL } = getAppEnvConfig();
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
export function uploadApi({ params, storeId }) {
  return http.uploadFile(
    {
      url: `${VITE_GLOB_API_URL}/Menu/Upload?storeId=${storeId}`,
      method: "post",
    },
    params
  );
}

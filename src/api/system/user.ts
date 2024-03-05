import { http } from "@/utils/http/axios";

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return {
    userId: "1",
    username: "admin",
    realName: "Admin",
    avatar: "http://dummyimage.com/120x60",
    desc: "manager",
    password: "DJMJSBQGG",
    token: "WFVNNAEFQFCSLAYDTUXUGOKMTJFJCFTG",
    permissions: [
      {
        label: "主控台",
        value: "dashboard_console",
      },
      {
        label: "监控页",
        value: "dashboard_monitor",
      },
      {
        label: "工作台",
        value: "dashboard_workplace",
      },
      {
        label: "基础列表",
        value: "basic_list",
      },
      {
        label: "基础列表删除",
        value: "basic_list_delete",
      },
    ],
  };
  return http.request({
    url: "/admin_info",
    method: "get",
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return {
    code: 0,
    result: {
      roles: [
        {
          roleName: "Super Admin",
          value: "super",
        },
      ],
      userId: "1",
      username: "vben",
      token: "fakeToken1",
      realName: "Vben Admin",
      desc: "manager",
    },
    message: "ok",
    type: "success",
  };
  return http.request<BasicResponseModel>(
    {
      url: "/login",
      method: "POST",
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return http.request(
    {
      url: `/user/u${uid}/changepw`,
      method: "POST",
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return http.request({
    url: "/login/logout",
    method: "POST",
    params,
  });
}

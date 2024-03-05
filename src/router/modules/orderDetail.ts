import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/router/constant";
import { LibraryBooksOutlined } from "@vicons/material";
import { renderIcon } from "@/utils/index";

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/orderDetail",
    name: "orderDetail",
    redirect: "/orderDetail/list",
    component: Layout,
    meta: {
      icon: renderIcon(LibraryBooksOutlined),
      sort: 2,
    },
    children: [
      {
        path: "list",
        name: "orderDetail-list",
        meta: {
          title: "跟團訂單",
        },
        component: () => import("@/views/orderDetail/list.vue"),
      },
      {
        path: "detail/:OrderId?/:OrderDetailId?",
        name: "orderDetail-detail",
        meta: {
          title: "明細",
          hidden: true,
        },
        component: () => import("@/views/orderDetail/detail.vue"),
      },
    ],
  },
];

export default routes;

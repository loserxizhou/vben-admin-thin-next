import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';

import { scrollWaiter } from './scrollWaiter';

import { createGuard } from './guard/';

import { basicRoutes } from './routes/';

// app router
const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes as RouteRecordRaw[], // 配置的两个基础路由(不需要权限验证的login和主框架根路由)
  strict: true, // ?  暂时没搞明白
  scrollBehavior: async (to, from, savedPosition) => {
    // 大概 使用keep-alive标签后部分安卓机返回缓存页位置不精确问题
    await scrollWaiter.wait();
    if (savedPosition) {
      return savedPosition;
    } else {
      if (to.matched.every((record, i) => from.matched[i] !== record)) {
        return { left: 0, top: 0 };
      }
      return false;
    }
  },
});

// reset router
export function resetRouter() {
  const resetWhiteNameList = [
    'Login',
    'Root',
    // 'FullErrorPage'
  ];
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// config router
export function setupRouter(app: App<Element>) {
  app.use(router);
  createGuard(router);
}

export default router;

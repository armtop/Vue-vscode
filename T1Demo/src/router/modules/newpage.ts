import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Blank from '@/layouts/blank.vue';
// import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/mynewpage',
    component: Blank,
    redirect: '/mynewpage/base',
    name: 'mynewpage',
    meta: {
      title: {
        zh_CN: '新菜单组',
        en_US: 'newMenuGroup',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 19,
    },
    children: [
      {
        path: 'base',
        name: 'newpageBase',
        component: () => import('@/pages/mynewpage/base/index.vue'),
        meta: {
          title: {
            zh_CN: '新页面',
            en_US: 'newpage',
          },
        },
      },
    ],
  },
];

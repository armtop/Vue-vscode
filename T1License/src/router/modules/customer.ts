import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/customermanage',
    component: Layout,
    redirect: '/customermanage/customer',
    name: 'customermanage',
    meta: {
      title: {
        zh_CN: '客户管理',
        en_US: 'customerGroup',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 19,
    },
    children: [
      {
        path: 'customer',
        name: 'customer',
        component: () => import('@/pages/customermanage/customer/index.vue'),
        meta: {
          title: {
            zh_CN: '客户',
            en_US: 'customer',
          },
        },
      },
    ],
  },
];

import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/licensemanage',
    component: Layout,
    redirect: '/licensemanage/license',
    name: 'licensemanage',
    meta: {
      title: {
        zh_CN: '许可管理',
        en_US: 'LicenseGroup',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 20,
    },
    children: [
      {
        path: 'license',
        name: 'license',
        component: () => import('@/pages/licensemanage/license/index.vue'),
        meta: {
          title: {
            zh_CN: '管理',
            en_US: 'manage',
          },
        },
      },
      {
        path: 'creation',
        name: 'creation',
        component: () => import('@/pages/licensemanage/creation/index.vue'),
        meta: {
          title: {
            zh_CN: '创建',
            en_US: 'creation',
          },
        },
      },
    ],
  },
];

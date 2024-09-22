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
            zh_CN: '许可',
            en_US: 'license',
          },
        },
      },
      {
        path: 'Addlicense',
        name: 'Addlicense',
        component: () => import('@/pages/customermanage/customer/components/DialogForm.vue'),
        meta: {
          title: {
            zh_CN: '编辑许可',
            en_US: 'editlicense',
          },
        },
      },
    ],
  },
];

<template>
  <t-row :gutter="[24, 24]">
    <t-col :span="9">
      <div class="user-left-greeting">
        <div>
          Hi，{{ userStore.userInfo.itemname || 'User' }}
          <span class="regular"> {{ $t('pages.user.markDay') }}</span>
        </div>
        <img src="@/assets/assets-tencent-logo.png" class="logo" />
      </div>

      <!-- 个人信息 -->
      <t-card class="user-info-list" :title="$t('pages.user.personalInfo.title')" :bordered="false">
        <template #actions>
          <!-- 编辑按钮
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button> -->
        </template>
        <t-descriptions :column="4" item-layout="vertical">
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.name')">
            {{ userStore.userInfo.itemname }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.id')">
            {{ userStore.userInfo.itemcode }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.emailStatus')">
            {{ userStore.userInfo.isemailconfirmed ? '已验证' : '未验证' }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.role')">
            {{ userStore.userInfo.isAdmin ? '管理员' : '普通用户' }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.joinDay')">
            {{ userStore.userInfo.createdate }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.lastLogin')">
            {{ userStore.userInfo.lastloginat }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.status')">
            {{ userStore.userInfo.disable ? '已禁用' : '正常' }}
          </t-descriptions-item>
        </t-descriptions>
      </t-card>
      <!-- 用户管理 -->
      <t-card class="content-container" :bordered="false">
        <t-tabs value="second">
          <t-tab-panel value="second" :label="$t('pages.user.userManage')">
            <t-table
              :data="userInfo"
              :columns="COLUMNS"
              :row-key="'account'"
              vertical-align="top"
              :hover="true"
              :pagination="pagination"
              :selected-row-keys="selectedRowKeys"
              :loading="loading"
              :header-affixed-top="headerAffixedTop"
              @page-change="handlePageChange"
              @change="rehandleChange"
              @select-change="handleSelectChange"
            >
              <template #op="slotProps">
                <t-space>
                  <t-button
                    v-if="!slotProps.row.disable"
                    theme="danger"
                    variant="text"
                    @click="handleDisableUser(slotProps.row.account)"
                  >
                    禁用
                  </t-button>
                  <t-button v-else theme="primary" variant="text" @click="handleEnableUser(slotProps.row.account)">
                    启用
                  </t-button>
                  <t-button
                    v-if="!slotProps.row.isAdmin"
                    theme="warning"
                    variant="text"
                    @click="handleSetAdmin(slotProps.row.itemcode)"
                  >
                    设为管理员
                  </t-button>
                  <t-button v-else theme="warning" variant="text" @click="handleRemoveAdmin(slotProps.row.account)">
                    移除管理员
                  </t-button>
                </t-space>
              </template>
            </t-table>
          </t-tab-panel>
        </t-tabs>
      </t-card>
    </t-col>
    <!-- 用户信息 -->
    <t-col :span="3">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">Tecul</t-avatar>
        <div class="name">{{ userStore.userInfo.name }}</div>
        <div class="position">{{ userStore.userInfo.isAdmin ? '管理员' : '普通用户' }}</div>
      </t-card>

      <!-- 团队成员 -->
      <t-card :title="$t('pages.user.teamMember')" class="user-team" :bordered="false">
        <template v-if="userStore.userInfo.isAdmin">
          <t-list v-if="disabledUsers.length" :split="false">
            <t-list-item v-for="(user, index) in disabledUsers" :key="index">
              <t-list-item-meta :title="user.itemname" :description="user.account" />
            </t-list-item>
          </t-list>
        </template>
      </t-card>

      <t-card :title="$t('pages.user.serviceProduction')" class="product-container" :bordered="false">
        <t-row class="content" :getters="16">
          <t-col v-for="(item, index) in PRODUCT_LIST" :key="index" :span="3">
            <component :is="getIcon(item)"></component>
          </t-col>
        </t-row>
      </t-card>
    </t-col>
  </t-row>
</template>
<script lang="ts">
export default {
  name: 'UserIndex',
};
</script>
<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { T1DisableUser, T1EnableUser, T1GetDisabledUsers, T1GetUserInfo, T1RemoveAdmin, T1SetAdmin } from '@/api/user';
import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';
import { prefix } from '@/config/global';
import { t } from '@/locales';
import { useSettingStore, useUserStore } from '@/store';
import { ApiStatusCode } from '@/types/api';
import { handleApiResponse } from '@/utils/apiHelper';
import { changeChartsTheme } from '@/utils/color';

import { PRODUCT_LIST } from './constants';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

let lineContainer: HTMLElement;
let lineChart: echarts.ECharts;
const store = useSettingStore();
const userStore = useUserStore();
const router = useRouter();

const updateContainer = () => {
  lineChart?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  });
};

onMounted(() => {
  window.addEventListener('resize', updateContainer, false);
  fetchDisabledUsers();
  fetchUserInfo();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

const getIcon = (type: string) => {
  switch (type) {
    case 'a':
      return ProductAIcon;
    case 'b':
      return ProductBIcon;
    case 'c':
      return ProductCIcon;
    case 'd':
      return ProductDIcon;
    default:
      return ProductAIcon;
  }
};

watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([lineChart]);
  },
);

const disabledUsers = ref([]);
const userInfo = ref([]);

const fetchDisabledUsers = async () => {
  if (userStore.userInfo.isAdmin) {
    try {
      const response = await T1GetDisabledUsers();
      handleApiResponse(response, {
        onSuccess: (data) => {
          disabledUsers.value = data || [];
        },
        onError: () => {
          disabledUsers.value = [];
        },
        onSpecificError: {
          [ApiStatusCode.TokenExpired]: () => {
            disabledUsers.value = [];
          },
          [ApiStatusCode.Unauthorized]: () => {
            disabledUsers.value = [];
          },
          [ApiStatusCode.NetworkError]: () => {
            disabledUsers.value = [];
          },
          [ApiStatusCode.DataNotExists]: () => {
            disabledUsers.value = [];
          },
        },
        router,
      });
    } catch (error) {
      console.error('fetchDisabledUsers方法捕捉到没有处理的错误，请检查代码:', error?.message);
      disabledUsers.value = [];
    }
  } else {
    console.error('没有权限访问');
  }
};

const fetchUserInfo = async () => {
  if (userStore.userInfo.isAdmin) {
    try {
      const response = await T1GetUserInfo();
      handleApiResponse(response, {
        onSuccess: (data) => {
          console.log('fetchUserInfo', data);
          userInfo.value = data || [];
        },
        onError: () => {
          userInfo.value = [];
        },
        onSpecificError: {
          [ApiStatusCode.TokenExpired]: () => {
            userInfo.value = [];
          },
          [ApiStatusCode.Unauthorized]: () => {
            userInfo.value = [];
          },
          [ApiStatusCode.NetworkError]: () => {
            userInfo.value = [];
          },
        },
        router,
      });
    } catch (error) {
      console.error('fetchUserInfo:', error?.message);
      disabledUsers.value = [];
    }
  } else {
    console.error('没有权限访问');
  }
};

interface TableRowData {
  itemname: string;
  itemcode: string;
  account: string;
  isEmailConfirmed: boolean;
  isAdmin: boolean;
  createdate: string;
  lastLoginAt: string;
  disable: boolean;
}

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: t('pages.user.personalInfo.desc.name'),
    align: 'left',
    width: 120,
    colKey: 'itemname',
    fixed: 'left',
  },
  {
    title: t('pages.user.personalInfo.desc.id'),
    width: 120,
    ellipsis: true,
    colKey: 'itemcode',
  },
  {
    title: t('pages.user.personalInfo.desc.account'),
    width: 120,
    ellipsis: true,
    colKey: 'account',
  },
  {
    title: t('pages.user.personalInfo.desc.emailStatus'),
    width: 120,
    ellipsis: true,
    colKey: 'isemailconfirmed',
    cell: (h: any, { row }: { row: TableRowData }) => (row.isEmailConfirmed ? '已验证' : '未验证'),
  },
  {
    title: t('pages.user.personalInfo.desc.role'),
    width: 120,
    ellipsis: true,
    colKey: 'isAdmin',
    cell: (h: any, { row }: { row: TableRowData }) => (row.isAdmin ? '管理员' : '普通用户'),
  },
  {
    title: t('pages.user.personalInfo.desc.joinDay'),
    width: 160,
    ellipsis: true,
    colKey: 'createdate',
  },
  {
    title: t('pages.user.personalInfo.desc.lastLogin'),
    width: 160,
    ellipsis: true,
    colKey: 'lastLoginAt',
  },
  {
    title: t('pages.user.personalInfo.desc.status'),
    width: 120,
    ellipsis: true,
    colKey: 'disable',
    cell: (h: any, { row }: { row: TableRowData }) => (row.disable ? '已禁用' : '正常'),
  },
  {
    title: t('pages.user.operation'),
    align: 'left',
    fixed: 'right',
    width: 200,
    colKey: 'op',
  },
];

const selectedRowKeys = ref([]);
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
});

const loading = ref(false);

const handleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};

const handlePageChange = (curr: number, pageInfo: any) => {
  pagination.value = {
    ...pagination.value,
    current: curr,
    ...pageInfo,
  };
  fetchUserInfo();
};

const handleDisableUser = async (userId: string) => {
  try {
    const response = await T1DisableUser(userId);
    handleApiResponse(response, {
      onSuccess: () => {
        MessagePlugin.success('用户已禁用');
        fetchUserInfo(); // 刷新列表
      },
      router,
    });
  } catch (error) {
    console.error('禁用用户失败:', error);
  }
};

const handleEnableUser = async (userId: string) => {
  try {
    const response = await T1EnableUser(userId);
    handleApiResponse(response, {
      onSuccess: () => {
        MessagePlugin.success('用户已启用');
        fetchUserInfo();
      },
      router,
    });
  } catch (error) {
    console.error('启用用户失败:', error);
  }
};

const handleSetAdmin = async (userId: string) => {
  try {
    const response = await T1SetAdmin(userId);
    handleApiResponse(response, {
      onSuccess: () => {
        MessagePlugin.success('已设置为管理员');
        fetchUserInfo();
      },
      router,
    });
  } catch (error) {
    console.error('设置管理员失败:', error);
  }
};

const handleRemoveAdmin = async (userId: string) => {
  try {
    const response = await T1RemoveAdmin(userId);
    handleApiResponse(response, {
      onSuccess: () => {
        MessagePlugin.success('已移除管理员权限');
        fetchUserInfo();
      },
      router,
    });
  } catch (error) {
    console.error('移除管理员权限失败:', error);
  }
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);

const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  console.log('统一Change', changeParams, triggerAndData);
};
</script>

<style lang="less" scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}

.content-container {
  :deep(.t-tabs) {
    height: 100%;
  }

  :deep(.t-table) {
    margin-top: var(--td-comp-margin-xl);
  }
}

.user-intro,
.user-team,
.product-container,
.user-left-greeting,
.user-info-list {
  margin-bottom: var(--td-comp-margin-xxl);
}
</style>

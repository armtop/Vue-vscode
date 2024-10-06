<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="formDialogVisible = true">{{ $t('pages.licenseManage.create') }}</t-button>
          <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">
            {{ $t('pages.licenseManage.batchDel') }}
          </t-button>
          <p v-if="!!selectedRowKeys.length" class="selected-count">
            {{ $t('pages.licenseManage.select') }} {{ selectedRowKeys.length }} {{ $t('pages.licenseManage.items') }}
          </p>
        </div>
        <div class="search-input">
          <t-input v-model="searchValue" :placeholder="$t('pages.licenseManage.placeholder')" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div>
      </t-row>

      <dialog-form v-model:visible="formDialogVisible" :data="formData" />

      <t-table
        :data="licenseList"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        @select-change="(value: number[]) => rehandleSelectChange(value)"
      >
        <template #licensetype="{ row }">
          <t-tag v-if="row.licensetype === LICENSE_TYPE.STANDARD.valueOf()" theme="danger" variant="light">
            {{ $t('pages.licenseManage.licenseTypeEnum.standard') }}
          </t-tag>
          <t-tag v-if="row.licensetype === LICENSE_TYPE.ENTERPRISE.valueOf()" theme="warning" variant="light">
            {{ $t('pages.licenseManage.licenseTypeEnum.enterprise') }}
          </t-tag>
          <t-tag v-if="row.licensetype === LICENSE_TYPE.T1YUN.valueOf()" theme="warning" variant="light">
            {{ $t('pages.licenseManage.licenseTypeEnum.t1cloud') }}
          </t-tag>
          <t-tag v-if="row.licensetype === LICENSE_TYPE.T1CLOUD.valueOf()" theme="success" variant="light">
            {{ $t('pages.licenseManage.licenseTypeEnum.t1yun') }}
          </t-tag>
        </template>
        <template #cap="{ row }">
          <div v-if="row.cap === 1" class="payment-col">
            {{ $t('pages.licenseManage.yes') }}
          </div>
        </template>

        <template #offline="{ row }">
          <div v-if="row.offline === 1" class="payment-col">
            {{ $t('pages.licenseManage.offlineEnum.on') }}<trend class="dashboard-item-trend" type="down" />
          </div>
        </template>
        <template #op="slotProps">
          <t-space>
            <t-link theme="primary" @click="handleClickDetail(slotProps)">
              {{ $t('pages.licenseManage.detail') }}</t-link
            >
            <t-link theme="danger" @click="handleClickDelete(slotProps)">
              {{ $t('pages.licenseManage.delete') }}</t-link
            >
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除当前所选许可？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'LicenseManage',
};
</script>

<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getLicenseList } from '@/api/license';
import Trend from '@/components/trend/index.vue';
import { prefix } from '@/config/global';
import { LICENSE_TYPE } from '@/constants';
import { t } from '@/locales';
import { useSettingStore } from '@/store';

import type { FormData } from '../creation/components/DialogForm.vue';
import DialogForm from '../creation/components/DialogForm.vue';

const store = useSettingStore();

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: t('pages.licenseManage.customer'),
    align: 'left',
    width: 160,
    colKey: 'customer',
    fixed: 'left',
  },
  {
    title: t('pages.licenseManage.license'),
    width: 360,
    ellipsis: true,
    colKey: 'license',
  },
  { title: t('pages.licenseManage.licensetype'), colKey: 'licensetype', width: 100 },
  {
    title: t('pages.licenseManage.cap'),
    width: 90,
    ellipsis: true,
    colKey: 'cap',
  },
  {
    title: t('pages.licenseManage.offline'),
    width: 90,
    ellipsis: true,
    colKey: 'offline',
  },
  {
    title: t('pages.licenseManage.AuthorizationNumber'),
    width: 110,
    ellipsis: true,
    colKey: 'AuthorizationNumber',
  },
  {
    title: t('pages.licenseManage.AuthorizedDays'),
    width: 100,
    ellipsis: true,
    colKey: 'AuthorizedDays',
  },
  {
    title: t('pages.licenseManage.startDate'),
    width: 120,
    ellipsis: true,
    colKey: 'startDate',
  },
  {
    title: t('pages.licenseManage.machineCode'),
    width: 360,
    ellipsis: true,
    colKey: 'machineCode',
  },
  {
    title: t('pages.licenseManage.ApplicationPackage'),
    width: 120,
    ellipsis: true,
    colKey: 'ApplicationPackage',
  },
  {
    title: t('pages.licenseManage.descr'),
    width: 160,
    ellipsis: true,
    colKey: 'descr',
  },
  {
    title: t('pages.licenseManage.operation'),
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
  },
];

const INITIAL_DATA: FormData = {
  ID: '', // 索引
  customer: '', // 客户名称
  license: '', //
  licensetype: 1, // license类型
  cap: '0', // 开通应用开发
  offline: '0', // 离线
  AuthorizationNumber: 0, // 授权数量
  AuthorizedDays: 0, // 使用期限
  startDate: '', // 启用日期
  machineCode: '', // 机器码
  ApplicationPackage: '', // 应用包授权
  descr: '', // 备注
};
const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });

const licenseList = ref([]);
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
});

const searchValue = ref('');

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const result = await getLicenseList();
    const { data } = result;
    licenseList.value = data;
    pagination.value = {
      ...pagination.value,
      total: data.length,
    };
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1) {
    const { name } = licenseList.value[deleteIdx.value];
    return `删除后，${name}的所有许可信息将被清空，且无法恢复`;
  }
  return '';
});

onMounted(() => {
  fetchData();
});

const confirmVisible = ref(false);

const selectedRowKeys = ref([]);

const router = useRouter();

const resetIdx = () => {
  deleteIdx.value = -1;
};

const onConfirmDelete = () => {
  // 真实业务请发起请求
  licenseList.value.splice(deleteIdx.value, 1);
  pagination.value.total = licenseList.value.length;
  const selectedIdx = selectedRowKeys.value.indexOf(deleteIdx.value);
  if (selectedIdx > -1) {
    selectedRowKeys.value.splice(selectedIdx, 1);
  }
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
  resetIdx();
};

const onCancel = () => {
  resetIdx();
};

const rowKey = 'index';

const rehandleSelectChange = (val: number[]) => {
  console.log('多选变化', val);
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr: unknown, pageInfo: unknown) => {
  console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickDetail = (row: { row: FormData }) => {
  formDialogVisible.value = true;
  formData.value = {
    ...row.row,
    cap: row.row.cap ? '1' : '0', //  修改为枚举
    offline: row.row.offline ? '1' : '0',
  };
};

const handleClickDelete = (row: { rowIndex: any }) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>

<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.list-card-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__body) {
    padding: 0;
  }
}

.left-operation-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--td-comp-margin-xxl);

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-l);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style>

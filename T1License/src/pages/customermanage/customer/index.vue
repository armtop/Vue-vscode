<template>
  <div>
    <div class="list-card-operation">
      <t-button @click="formDialogVisible = true">{{ $t('pages.customerlistCard.create') }}</t-button>
      <div class="search-input">
        <t-input
          v-model="searchValue"
          :placeholder="$t('pages.customerlistCard.placeholder')"
          clearable
          @input="handleSearch"
          @clear="resetSearch"
        >
          <template #suffix-icon>
            <search-icon v-if="searchValue === ''" size="var(--td-comp-size-xxxs)" />
          </template>
        </t-input>
      </div>
    </div>

    <dialog-form v-model:visible="formDialogVisible" :data="formData" />

    <template v-if="pagination.total > 0 && !dataLoading">
      <div class="list-card-items">
        <t-row :gutter="[16, 16]">
          <t-col
            v-for="customer in customerList.slice(
              pagination.pageSize * (pagination.current - 1),
              pagination.pageSize * pagination.current,
            )"
            :key="customer.ID"
            :lg="4"
            :xs="6"
            :xl="3"
          >
            <customer-card
              class="list-card-item"
              :customer="customer"
              @license-customer="handleLicenseCustomer"
              @delete-item="handleDeleteItem"
              @manage-customer="handleManageCustomer"
            />
          </t-col>
        </t-row>
      </div>
      <div class="list-card-pagination">
        <t-pagination
          v-model="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-size-options="[12, 24, 36]"
          @page-size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </template>

    <div v-else-if="dataLoading" class="list-card-loading">
      <t-loading size="large" text="加载数据中..." />
    </div>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'CustomerListCard',
};
</script>

<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getCustomerList } from '@/api/customer';
import type { CardCustomerType } from '@/components/customer-card/index.vue';
import CustomerCard from '@/components/customer-card/index.vue';
import { useCustomerStore } from '@/store';

import type { FormData } from './components/DialogForm.vue';
import DialogForm from './components/DialogForm.vue';

const INITIAL_DATA: FormData = {
  ID: '0',
  name: '',
  isSetup: '0',
  type: 2,
  description: '',
  businessLicenseNumber: '',
  businessPersonName: '',
  businessPersonIdNumber: '',
  businessPersonPhoneNumber: '',
  contactAddress: '',
};

const pagination = ref({ current: 1, pageSize: 12, total: 0 });
const deleteCustomer = ref(undefined);
const router = useRouter();

// const customerList = ref(Array<CustomerModel>);
const customerList = ref([]);
const dataLoading = ref(true);

const fetchData = async () => {
  try {
    const result = await getCustomerList();
    const { data } = result;
    customerList.value = data;
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

const handleSearch = () => {
  console.log(searchValue.value.trim()); // 添加日志以确认函数被调用
  if (searchValue.value.trim() === '') {
    fetchData();
  } else {
    customerList.value = customerList.value.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        customer.description.toLowerCase().includes(searchValue.value.toLowerCase()),
    );
  }
  pagination.value.current = 1;
  pagination.value.total = customerList.value.length;
};

const resetSearch = () => {
  fetchData();
  pagination.value.current = 1;
  pagination.value.total = customerList.value.length;
};

const confirmBody = computed(() =>
  deleteCustomer.value ? `确认删除后${deleteCustomer.value.name}的所有信息将被清空, 且无法恢复` : '',
);

onMounted(() => {
  fetchData();
});

const formDialogVisible = ref(false);
const confirmVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const searchValue = ref('');

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1;
};
const onCurrentChange = (current: number) => {
  pagination.value.current = current;
};

const handleDeleteItem = (customer: CardCustomerType) => {
  confirmVisible.value = true;
  deleteCustomer.value = customer;
};

const onConfirmDelete = () => {
  const { ID } = deleteCustomer.value;
  const initialLength = customerList.value.length;
  customerList.value = customerList.value.filter((customer) => customer.ID !== ID);
  if (customerList.value.length < initialLength) {
    confirmVisible.value = false;
    MessagePlugin.success('删除成功');
  } else {
    MessagePlugin.error('未找到要删除的客户');
  }
  // 更新分页信息
  pagination.value.total = customerList.value.length;
  pagination.value.current = 1;
};

const onCancel = () => {
  deleteCustomer.value = undefined;
  formData.value = { ...INITIAL_DATA };
};

const handleManageCustomer = (customer: CardCustomerType) => {
  formDialogVisible.value = true;
  formData.value = {
    ...INITIAL_DATA,
    ...customer,
    isSetup: customer.isSetup ? '1' : '0', //  修改为枚举
    ID: customer.ID.toString(), // 将 ID 转换为字符串
  };
};

const customerStore = useCustomerStore();
const handleLicenseCustomer = (customer: CardCustomerType) => {
  // 情况之前的数据
  customerStore.clearCustomer();
  // 保存customer到store
  customerStore.setCustomer(customer);
  // 跳转到许可创建界面
  router.push({ name: 'creation' });
};
</script>
<style lang="less" scoped>
.list-card {
  height: 100%;

  &-operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--td-comp-margin-xxl);

    .search-input {
      width: 360px;
    }
  }

  &-item {
    padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingTB-xl);

    :deep(.t-card__header) {
      padding: 0;
    }

    :deep(.t-card__body) {
      padding: 0;
      margin-top: var(--td-comp-margin-xxl);
      margin-bottom: var(--td-comp-margin-xxl);
    }

    :deep(.t-card__footer) {
      padding: 0;
    }
  }

  &-pagination {
    padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingTB-xl);
  }

  &-loading {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

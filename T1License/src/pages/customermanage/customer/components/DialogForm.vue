<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="$t('pages.customerlistCard.edit')"
    :width="680"
    :footer="false"
    @close-btn-click="onClickCloseBtn"
  >
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <!-- ID 字段在新增和编辑时都不显示 -->

        <!-- itemCode 字段只在编辑时显示 -->
        <t-form-item v-if="formData.id" :label="$t('pages.customerlistCard.customerCode')" name="itemCode">
          <t-input v-model="formData.itemCode" :style="{ width: '480px' }" readonly disabled />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerName')" name="name">
          <t-input v-model="formData.itemName" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerisSetup')" name="isSetup">
          <t-radio-group v-model="formData.isSetup">
            <t-radio :value="true">{{ $t('pages.customerlistCard.customerisSetupEnum.on') }}</t-radio>
            <t-radio :value="false">{{ $t('pages.customerlistCard.customerisSetupEnum.off') }}</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerType')" name="type">
          <t-select v-model="formData.category" clearable :style="{ width: '480px' }">
            <t-option v-for="(item, index) in SELECT_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerDescription')" name="description">
          <t-input v-model="formData.description" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessLicenseNumber')" name="businessLicenseNumber">
          <t-input v-model="formData.registNumber" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessPersonName')" name="businessPersonName">
          <t-input v-model="formData.manager" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessPersonIdNumber')" name="businessPersonIdNumber">
          <t-input v-model="formData.idCardNumber" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessPersonPhoneNumber')" name="businessPersonPhoneNumber">
          <t-input v-model="formData.phoneNumber" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.contactAddress')" name="contactAddress">
          <t-input v-model="formData.address" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { FormRules, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import type { PropType } from 'vue';
import { onMounted, ref, watch } from 'vue';

import { T1AddCustomer, T1UpdateCustomer } from '@/api/customer';
import type { CustomerModel } from '@/api/model/customerModel';
import { ApiStatusCode } from '@/types/api';
import { handleApiResponse } from '@/utils/apiHelper';

// 生成32位uuid
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 0x8;
    return v.toString(16);
  });
};

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(6, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const emit = defineEmits(['update:visible', 'refresh']);

const INITIAL_DATA: CustomerModel = {
  id: uuid(),
  itemCode: '', // 客户编码
  itemName: '', // 客户名称
  isSetup: false, // 是否已启用
  category: '1', // 客户类型
  description: '', // 描述
  registNumber: '', // 营业执照注册号
  manager: '', // 营业者
  idCardNumber: '', // 营业者身份证号
  phoneNumber: '', // 营业者手机号
  address: '', // 联系地址
  createDate: getCurrentDateTime(), // 创建时间
  updateDate: getCurrentDateTime(), // 更新时间
};

const SELECT_OPTIONS = [
  { label: '重要客户', value: '1' },
  { label: '普通客户', value: '2' },
  { label: '间接客户', value: '3' },
  { label: '合作伙伴', value: '4' },
  { label: '代理商', value: '5' },
];

onMounted(() => {});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: Object as PropType<CustomerModel>,
});
const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });

const onSubmit = async ({ _validateResult, firstError }: SubmitContext) => {
  if (firstError) {
    MessagePlugin.warning(firstError);
    return;
  }

  try {
    const customerData: CustomerModel = {
      ...(formData.value.id
        ? {
            id: formData.value.id,
            itemCode: formData.value.itemCode,
          }
        : {}),
      itemName: formData.value.itemName,
      isSetup: formData.value.isSetup,
      category: formData.value.category,
      description: formData.value.description,
      registNumber: formData.value.registNumber,
      manager: formData.value.manager,
      idCardNumber: formData.value.idCardNumber,
      phoneNumber: formData.value.phoneNumber,
      address: formData.value.address,
      createDate: formData.value.createDate,
      updateDate: getCurrentDateTime(),
    };

    const response = await (formData.value.id ? T1UpdateCustomer(customerData) : T1AddCustomer(customerData));

    handleApiResponse(response, {
      onSuccess: () => {
        MessagePlugin.success(formData.value.id ? '更新成功' : '新增成功');
        formVisible.value = false;
        formData.value = { ...INITIAL_DATA };
        emit('refresh');
      },
      onError: () => {
        MessagePlugin.error(formData.value.id ? '更新失败' : '新增失败');
      },
      onSpecificError: {
        [ApiStatusCode.DataAlreadyExists]: () => {
          MessagePlugin.error('客户已存在');
        },
        [ApiStatusCode.ValidationError]: () => {
          MessagePlugin.error('数据验证失败');
        },
      },
    });
  } catch (error) {
    console.error('保存客户数据失败:', error);
    MessagePlugin.error('保存失败，请稍后重试');
    console.log(_validateResult);
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  formData.value = { ...INITIAL_DATA };
};

// 监听 formVisible 的变化
watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val);
  },
);

// 监听 props.visible 的变化
watch(
  () => props.visible,
  (val) => {
    formVisible.value = val;
    if (val) {
      formData.value = { ...(props.data || INITIAL_DATA) };
      console.log('初始化表单数据:', formData.value);
    }
  },
);

watch(
  () => props.data,
  (val) => {
    if (val) {
      formData.value = { ...val };
    }
  },
);

const rules: FormRules<CustomerModel> = {
  itemName: [{ required: true, message: '请输入客户名称', type: 'error' }],
};
</script>

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
        <t-form-item :label="$t('pages.customerlistCard.customerID')" name="ID">
          <t-input v-model="formData.id" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerCode')" name="ID">
          <t-input v-model="formData.itemCode" :style="{ width: '480px' }" />
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

import { T1AddCustomer } from '@/api/customer';
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

const onSubmit = async ({ validateResult, firstError }: SubmitContext) => {
  if (firstError) {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
    return;
  }

  try {
    const customerData: CustomerModel = {
      itemCode: formData.value.itemCode, // 客户编码
      itemName: formData.value.itemName, // 客户名称
      isSetup: formData.value.isSetup, // 是否已启用
      category: formData.value.category, // 客户类型
      description: formData.value.description, // 描述
      registNumber: formData.value.registNumber, // 营业执照注册号
      manager: formData.value.manager, // 营业者
      idCardNumber: formData.value.idCardNumber, // 营业者身份证号
      phoneNumber: formData.value.phoneNumber, // 营业者手机号
      address: formData.value.address, // 联系地址
      createDate: formData.value.createDate, // 创建时间
      updateDate: formData.value.updateDate, // 更新时间
    };

    const response = await T1AddCustomer(customerData);

    handleApiResponse(response, {
      onSuccess: () => {
        MessagePlugin.success('保存成功');
        formVisible.value = false;
        formData.value = { ...INITIAL_DATA };
        emit('refresh');
      },
      onError: () => {
        MessagePlugin.error('保存失败');
      },
      onSpecificError: {
        [ApiStatusCode.DataAlreadyExists]: () => {
          MessagePlugin.error('客户已存在');
        },
        [ApiStatusCode.ValidationError]: () => {
          MessagePlugin.error('数据验证失败');
        },
        [ApiStatusCode.TokenExpired]: () => {
          MessagePlugin.error('登录已过期，请重新登录');
        },
        [ApiStatusCode.RequestCanceled]: () => {
          console.warn('请求被取消');
        },
      },
    });
  } catch (error) {
    console.error('保存客户数据失败:', error);
    MessagePlugin.error('保存失败，请稍后重试');
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  formData.value = { ...INITIAL_DATA };
};

watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val);
  },
);

watch(
  () => props.visible,
  (val) => {
    formVisible.value = val;
    if (val) {
      if (props.data) {
        formData.value = { ...props.data };
      } else {
        formData.value = { ...INITIAL_DATA };
      }
    }
    console.log('formData.isSetup:', formData.value.isSetup);
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

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
          <t-input v-model="formData.ID" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerName')" name="name">
          <t-input v-model="formData.name" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerisSetup')" name="isSetup">
          <t-radio-group v-model="formData.isSetup">
            <t-radio value="0">{{ $t('pages.customerlistCard.customerisSetupEnum.off') }}</t-radio>
            <t-radio value="1">{{ $t('pages.customerlistCard.customerisSetupEnum.on') }}</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerType')" name="type">
          <t-select v-model="formData.type" clearable :style="{ width: '480px' }">
            <t-option v-for="(item, index) in SELECT_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.customerDescription')" name="description">
          <t-input v-model="formData.description" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessLicenseNumber')" name="businessLicenseNumber">
          <t-input v-model="formData.businessLicenseNumber" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessPersonName')" name="businessPersonName">
          <t-input v-model="formData.businessPersonName" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessPersonIdNumber')" name="businessPersonIdNumber">
          <t-input v-model="formData.businessPersonIdNumber" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.businessPersonPhoneNumber')" name="businessPersonPhoneNumber">
          <t-input v-model="formData.businessPersonPhoneNumber" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item :label="$t('pages.customerlistCard.contactAddress')" name="contactAddress">
          <t-input v-model="formData.contactAddress" :style="{ width: '480px' }" />
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

import { getGeneralList } from '@/api/general';

export interface FormData {
  ID: string; // 客户ID
  name: string; // 客户名称
  isSetup: string; // 是否已启用
  type: number; // 客户类型
  description: string; // 描述
  businessLicenseNumber: string; // 营业执照注册号
  businessPersonName: string; // 营业者
  businessPersonIdNumber: string; // 营业者身份证号
  businessPersonPhoneNumber: string; // 营业者手机号
  contactAddress: string; // 联系地址
}

const now = new Date();
const year = String(now.getFullYear()).slice(2);
const month = `0${now.getMonth() + 1}`.slice(-2);
const date = `0${now.getDate()}`.slice(-2);
const hour = `0${now.getHours()}`.slice(-2);
const minute = `0${now.getMinutes()}`.slice(-2);
const second = `0${now.getSeconds()}`.slice(-2);
const millisecond = `00${now.getMilliseconds()}`.slice(-3);
const randomNumber = `${year}${month}${date}${hour}${minute}${second}${millisecond}`;

const INITIAL_DATA: FormData = {
  ID: randomNumber,
  name: '',
  isSetup: '1',
  type: 1,
  description: '',
  businessLicenseNumber: '',
  businessPersonName: '',
  businessPersonIdNumber: '',
  businessPersonPhoneNumber: '',
  contactAddress: '',
};

// 替换成API从数据库取枚举
const SELECT_OPTIONS = ref([]);
const fetchData = async () => {
  try {
    const { data } = await getGeneralList('customertype');
    SELECT_OPTIONS.value = data;
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  fetchData();
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: Object as PropType<FormData>,
});
const formVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });

const onSubmit = ({ validateResult, firstError }: SubmitContext) => {
  if (!firstError) {
    // 需要优化代码，调用API保存数据
    MessagePlugin.success('提交成功');
    formVisible.value = false;
    formData.value = { ...INITIAL_DATA };
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  formData.value = { ...INITIAL_DATA };
};

const emit = defineEmits(['update:visible']);
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
  },
);

watch(
  () => props.data,
  (val) => {
    formData.value = val;
  },
);

const rules: FormRules<FormData> = {
  name: [{ required: true, message: '请输入客户名称', type: 'error' }],
};
</script>

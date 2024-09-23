<template>
  <t-dialog
    v-model:visible="formVisible"
    :header="$t('pages.licenseManage.edit')"
    :width="680"
    :footer="false"
    @close-btn-click="onClickCloseBtn"
  >
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <t-form-item :label="$t('pages.licenseManage.licensetype')" name="licensetype">
          <t-select v-model="formData.licensetype" clearable :style="{ width: '480px' }">
            <t-option v-for="(item, index) in SELECT_LICENSETYPE" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>

        <t-form-item :label="$t('pages.licenseManage.cap')" name="cap">
          <t-radio-group v-model="formData.cap">
            <t-radio value="0">{{ $t('pages.licenseManage.capEnum.off') }}</t-radio>
            <t-radio value="1">{{ $t('pages.licenseManage.capEnum.on') }}</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item :label="$t('pages.licenseManage.offline')" name="offline">
          <t-radio-group v-model="formData.offline">
            <t-radio value="0">{{ $t('pages.licenseManage.offlineEnum.off') }}</t-radio>
            <t-radio value="1">{{ $t('pages.licenseManage.offlineEnum.on') }}</t-radio>
          </t-radio-group>
        </t-form-item>

        <t-form-item :label="$t('pages.licenseManage.AuthorizationNumber')" name="AuthorizationNumber">
          <t-input v-model="formData.AuthorizationNumber" :style="{ width: '480px' }" />
        </t-form-item>

        <t-form-item :label="$t('pages.licenseManage.AuthorizedDays')" name="AuthorizedDays">
          <t-input v-model="formData.AuthorizedDays" :style="{ width: '480px' }" />
        </t-form-item>

        <t-form-item :label="$t('pages.licenseManage.startDate')" name="startDate">
          <t-input v-model="formData.startDate" :style="{ width: '480px' }" />
        </t-form-item>

        <t-form-item :label="$t('pages.licenseManage.machineCode')" name="machineCode">
          <t-input v-model="formData.machineCode" :style="{ width: '480px' }" />
        </t-form-item>

        <t-form-item :label="$t('pages.licenseManage.ApplicationPackage')" name="ApplicationPackage">
          <t-input v-model="formData.ApplicationPackage" :style="{ width: '480px' }" />
        </t-form-item>

        <t-form-item :label="$t('pages.licenseManage.descr')" name="descr">
          <t-input v-model="formData.descr" :style="{ width: '480px' }" />
        </t-form-item>

        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">{{ $t('pages.licenseManage.cancel') }}</t-button>
          <t-button theme="primary" type="submit">{{ $t('pages.licenseManage.confirm') }}</t-button>
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
  ID: string; // 索引
  customer: string; // 客户名称
  license: string; //
  licensetype: number; // license类型
  cap: string; // 开通应用开发
  offline: string; // 离线
  AuthorizationNumber: number; // 授权数量
  AuthorizedDays: number; // 使用期限
  startDate: string; // 启用日期
  machineCode: string; // 机器码
  ApplicationPackage: string; // 应用包授权
  descr: string; // 备注
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
  customer: '',
  license: '',
  licensetype: 1,
  cap: '0',
  offline: '0',
  AuthorizationNumber: 0,
  AuthorizedDays: 0,
  startDate: new Date().toString(),
  machineCode: '',
  ApplicationPackage: '',
  descr: '',
};

// 替换成API从数据库取值
const SELECT_LICENSETYPE = ref([]);
const fetchData = async () => {
  try {
    const { data } = await getGeneralList('licensetype');
    SELECT_LICENSETYPE.value = data;
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  fetchData();
});

// 定义了一个 Vue 组件的Props，它包含多个属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: Object as PropType<FormData>,
  customer: String, // 客户名称,如果为空，则此页面的保存按钮将不显示
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
  licensetype: [{ required: true, message: "$t('pages.licenseManage.inputlicensetype')", type: 'error' }],
};
</script>

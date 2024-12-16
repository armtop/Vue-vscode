<template>
  <t-form
    ref="form"
    :class="['item-container', `register-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'phone'">
      <t-form-item name="phone">
        <t-input v-model="formData.phone" :maxlength="11" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <template v-if="type == 'email'">
      <t-form-item name="email">
        <t-input v-model="formData.email" type="text" size="large" placeholder="请输入您的邮箱">
          <template #prefix-icon>
            <t-icon name="mail" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <template v-if="type == 'phone'">
      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox> <span>T1Yun服务协议</span> 和
      <span>T1Yun 隐私声明</span>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>
    <!--
    <div class="switch-container">
      <span class="tip" @click="switchType(type == 'phone' ? 'email' : 'phone')">{{
        type == 'phone' ? '使用邮箱注册' : '使用手机号注册'
      }}</span>
    </div>
-->
  </t-form>
</template>

<script setup lang="ts">
import type { FormRule, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { T1Register } from '@/api/user';
import { useCounter } from '@/hooks';
import { ApiStatusCode } from '@/types/api';
import { handleApiResponse } from '@/utils/apiHelper';
import { cryptoUtils } from '@/utils/crypto';

const INITIAL_DATA = {
  phone: '',
  email: '',
  password: '',
  verifyCode: '',
  checked: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  email: [
    { required: true, message: '邮箱必填', type: 'error' },
    { email: true, message: '请输入正确的邮箱', type: 'warning' },
  ],
  password: [
    { required: true, message: '密码必填', type: 'error' },
    {
      validator: (val) => {
        return val.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val);
      },
      message: '密码至少8位，必须包含大小写字母和数字',
      type: 'warning',
    },
  ],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
};

const type = ref('email');
const router = useRouter();
const form = ref();
const formData = ref({ ...INITIAL_DATA });

const showPsw = ref(false);

const [countDown, handleCounter] = useCounter();

const emit = defineEmits(['registerSuccess']);

const onSubmit = async (ctx: SubmitContext) => {
  if (ctx.validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error('请同意服务协议和隐私声明');
      return;
    }

    try {
      // 第一次加密密码
      const firstHash = cryptoUtils.generateFirstHash(formData.value.password);

      const handleRegister = async () => {
        const response = await T1Register({
          account: formData.value.email,
          password: firstHash,
        });

        return response;
      };

      const res = await handleRegister();

      handleApiResponse(res, {
        onSuccess: (data) => {
          console.log('请求成功', data);
          MessagePlugin.success('请登录注册邮箱激活账号');
          emit('registerSuccess');
        },
        onError: (error) => {
          console.error('请求失败', error?.errorMessage);
          throw res;
        },
        onSpecificError: {
          [ApiStatusCode.TokenExpired]: () => {
            // 处理token过期
            router.push('/login');
          },
          [ApiStatusCode.Unauthorized]: () => {
            // 处理未授权
          },
        },
      });
    } catch (error) {
      console.error('注册onSubmit方法捕捉到没有处理的错误，请检查代码:', error?.message);
      MessagePlugin.error(error?.message);
    }
  }
};

const switchType = (val: string) => {
  form.value.reset();
  type.value = val;
};
</script>

<style lang="less" scoped>
@import '../index.less';
</style>

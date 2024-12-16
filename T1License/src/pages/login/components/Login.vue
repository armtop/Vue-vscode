<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.account" size="large" :placeholder="`${$t('pages.login.input.account')}`">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          :placeholder="`${$t('pages.login.input.password')}`"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <!--<t-checkbox>{{ $t('pages.login.remember') }}</t-checkbox>-->
        <span class="tip" @click="switchType('forget')">{{ $t('pages.login.forget') }}</span>
      </div>
    </template>

    <template v-else-if="type === 'forget'">
      <t-form-item name="account">
        <t-input v-model="formData.account" size="large" :placeholder="'请输入账号'">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入新密码"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <!-- 扫码登录 
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">{{ $t('pages.login.wechatLogin') }}</span>
        <span class="refresh">{{ $t('pages.login.refresh') }} <t-icon name="refresh" /> </span>
      </div>
      <qrcode-vue value="" :size="160" level="H" />
    </template>
    -->

    <!-- 手机号登录 
    <template v-else>
      <t-form-item name="phone">
        <t-input v-model="formData.phone" size="large" :placeholder="$t('pages.login.input.phone')">
          <template #prefix-icon>
            <t-icon name="mobile" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" :placeholder="$t('pages.login.input.verification')" />
        <t-button size="large" variant="outline" :disabled="countDown > 0" @click="sendCode">
          {{ countDown == 0 ? $t('pages.login.sendVerification') : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>
    -->

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit">
        {{ type === 'forget' ? '重置密码' : $t('pages.login.signIn') }}
      </t-button>
    </t-form-item>

    <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">{{
        $t('pages.login.accountLogin')
      }}</span>
      <!--
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">{{
        $t('pages.login.wechatLogin')
      }}</span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">{{ $t('pages.login.phoneLogin') }}</span>
      -->
    </div>
  </t-form>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import type { FormInstanceFunctions, FormRule, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { T1RestPasswd } from '@/api/user';
import { useCounter } from '@/hooks';
import { t } from '@/locales';
import { useUserStore } from '@/store';
import { ApiStatusCode } from '@/types/api';
import { handleApiResponse } from '@/utils/apiHelper';
import { cryptoUtils } from '@/utils/crypto';

const userStore = useUserStore();

const INITIAL_DATA = {
  phone: '',
  account: '',
  password: '',
  verifyCode: '',
  checked: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
  phone: [{ required: true, message: t('pages.login.required.phone'), type: 'error' }],
  // account: [{ required: true, message: t('pages.login.required.account'), type: 'error' }],
  account: [
    { required: true, message: '邮箱必填', type: 'error' },
    { email: true, message: '请输入正确的邮箱', type: 'warning' },
  ],
  // password: [{ required: true, message: t('pages.login.required.password'), type: 'error' }],
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
  verifyCode: [{ required: true, message: t('pages.login.required.verification'), type: 'error' }],
};

const type = ref('password');

const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const [countDown, handleCounter] = useCounter();

const switchType = (val: string) => {
  type.value = val;
};

const router = useRouter();
const route = useRoute();

/**
 * 发送验证码
 
const sendCode = () => {
  form.value.validate({ fields: ['phone'] }).then((e) => {
    if (e === true) {
      handleCounter();
    }
  });
};
*/
const onSubmit = async (ctx: SubmitContext) => {
  if (ctx.validateResult === true) {
    try {
      if (type.value === 'forget') {
        // 第一次加密密码
        const firstHash = cryptoUtils.generateFirstHash(formData.value.password);
        // 调用重置密码API
        const handleResetPasswd = async () => {
          const response = await T1RestPasswd({
            account: formData.value.account,
            newPassword: firstHash,
          });

          return response;
        };

        const res = await handleResetPasswd();

        handleApiResponse(res, {
          onSuccess: (data) => {
            MessagePlugin.success('请登录邮箱激活新密码');
            switchType('password');
            formData.value = { ...INITIAL_DATA };
          },
          onError: (error) => {
            console.error('请求失败', error?.errorMessage);
            throw res;
          },
          onSpecificError: {
            [ApiStatusCode.TokenExpired]: () => {
              // 处理token过期
            },
            [ApiStatusCode.Unauthorized]: () => {
              // 处理未授权
            },
          },
        });
      } else {
        //  第一次加密密码
        const firstHash = cryptoUtils.generateFirstHash(formData.value.password);

        const userInfo: Record<string, unknown> = {
          account: formData.value.account,
          password: firstHash,
        };

        await userStore.login(userInfo);

        MessagePlugin.success('登录成功');
        const redirect = route.query.redirect as string;
        const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard';
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error('登录onSubmit方法捕捉到没有处理的错误，请检查代码:', error?.message);
      MessagePlugin.error(error?.message);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../index.less';
</style>

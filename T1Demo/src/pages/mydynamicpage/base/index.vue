<template>
  <div>
    <button @click="fetchData">获取数据</button>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="data">数据获取成功: {{ data }}</div>
  </div>
  <div>
    <button @click="fetchUserData">获取用户数据</button>
    <div v-if="userloading">加载中...</div>
    <div v-else-if="usererror">{{ usererror }}</div>
    <div v-else-if="userdata">数据获取成功: {{ userdata }}</div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

import { getToken } from '@/api/accesstoken';
import { getUserToken } from '@/api/usertoken';

export default {
  name: 'FetchDataComponent',
  setup() {
    const data = ref();
    const userdata = ref();
    const loading = ref(false);
    const userloading = ref(false);
    const error = ref<string | null>(null);
    const usererror = ref<string | null>(null);
    const appid = 'tkdaac44a6ad934043';
    const secret = '66432e306ade465499cf82ed63526cc0';
    const user = 'T08';
    const passwd = '123456';

    const fetchData = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await getToken(appid, secret);
        data.value = response;
      } catch (err) {
        error.value = `数据获取失败:${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    const fetchUserData = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await getUserToken(user, passwd);
        userdata.value = response;
      } catch (err) {
        usererror.value = `数据获取失败:${err.message}`;
      } finally {
        userloading.value = false;
      }
    };

    return {
      data,
      loading,
      error,
      userdata,
      userloading,
      usererror,
      fetchData,
      fetchUserData,
    };
  },
};
</script>

<style scoped>
button {
  margin-bottom: 10px;
}
</style>

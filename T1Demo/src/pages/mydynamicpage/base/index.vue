<template>
  <div>
    <button @click="fetchData">获取数据</button>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="data">数据获取成功: {{ data.name }}</div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

interface Data {
  id: number;
  name: string;
}

export default {
  name: 'FetchDataComponent',
  setup() {
    const data = ref<Data | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchData = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await new Promise<Data>((resolve, reject) => {
          setTimeout(() => {
            const fetchedData = { id: 1, name: 'John Doe' };
            resolve(fetchedData);
          }, 2000);
        });

        data.value = response;
      } catch (err) {
        error.value = '数据获取失败';
      } finally {
        loading.value = false;
      }
    };

    return {
      data,
      loading,
      error,
      fetchData,
    };
  },
};
</script>

<style scoped>
button {
  margin-bottom: 10px;
}
</style>

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
  <div>
    <button @click="fetchTickets">获取序时簿</button>
    <div v-if="ticketsloading">加载中...</div>
    <div v-else-if="ticketserror">{{ ticketserror }}</div>
    <div v-else-if="ticketsdata">数据获取成功: {{ ticketsdata }}</div>
  </div>
  <div>
    <button @click="fetchBill">获取单条记录</button>
    <div v-if="billloading">加载中...</div>
    <div v-else-if="billerror">{{ billerror }}</div>
    <div v-else-if="billdata">数据获取成功: {{ billdata }}</div>
  </div>
  <div>
    <button @click="fetchCreateBill">创建记录</button>
    <div v-if="crbillloading">加载中...</div>
    <div v-else-if="crbillerror">{{ crbillerror }}</div>
    <div v-else-if="crbilldata">数据获取成功: {{ crbilldata }}</div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

import { getToken } from '@/api/accesstoken';
import { createBill, getBill } from '@/api/bill';
import { getTickets } from '@/api/params';
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
    const ticketsloading = ref(false);
    const ticketserror = ref<string | null>(null);
    const ticketsdata = ref();
    const billloading = ref(false);
    const billerror = ref<string | null>(null);
    const billdata = ref();
    const crbillloading = ref(false);
    const crbillerror = ref<string | null>(null);
    const crbilldata = ref();
    // 创建时间戳
    const timestamp = Date.now();

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
      userloading.value = true;
      usererror.value = null;

      try {
        const response = await getUserToken(user, passwd);
        userdata.value = response;
      } catch (err) {
        usererror.value = `数据获取失败:${err.message}`;
      } finally {
        userloading.value = false;
      }
    };

    const fetchTickets = async () => {
      ticketsloading.value = true;
      ticketserror.value = null;

      try {
        const response = await getTickets(5);
        ticketsdata.value = response;
      } catch (err) {
        ticketserror.value = `数据获取失败:${err.message}`;
      } finally {
        ticketsloading.value = false;
      }
    };

    const fetchBill = async () => {
      billloading.value = true;
      billerror.value = null;

      try {
        const response = await getBill('CustomerB', 'C20240729-0001');
        billdata.value = response;
      } catch (err) {
        billerror.value = `数据获取失败:${err.message}`;
      } finally {
        billloading.value = false;
      }
    };

    const fetchCreateBill = async () => {
      crbillloading.value = true;
      crbillerror.value = null;
      const billbody = `{"ItemCode":"${timestamp.toString()}","ItemName":"${timestamp.toString()}","Province":"广东省","City":"广州市","Area":"天河区","Address":"广东省-广州市-天河区石牌桥236号","OwnerDep":"工程管理部","IsIgnore":"N","IsLock":"N","IsMateMove":"N","CRMOwner":"曾德馨","CustomerRegion":"华东","CustomerType":"个人","ManageOrg":"","OrgType":"","Contacts":"","ContactTitle":"","LegalRepresentative":"","Bank":"","BankAccount":"","DutyParagraph":"","CompanyEmail":"","EmployeesCount":"0","CustomerTypes":"","CustomerGrade":"","CreditRating":"","Enable":"N","Salesman":"","InDueFlag":"N","R":"","Liaison":"","ModifyBy":"","Addresss":"","Country":"中国","OwnerDepSecond":"加装改造科","CustomerStatus":"跟进中","state":"none"}`;

      try {
        const response = await createBill('CustomerB', billbody);
        crbilldata.value = response;
      } catch (err) {
        crbillerror.value = `数据创建失败:${err.message}`;
      } finally {
        crbillloading.value = false;
      }
    };

    return {
      data,
      loading,
      error,
      userdata,
      userloading,
      usererror,
      ticketsloading,
      ticketserror,
      ticketsdata,
      billloading,
      billerror,
      billdata,
      crbillloading,
      crbillerror,
      crbilldata,
      fetchData,
      fetchUserData,
      fetchTickets,
      fetchBill,
      fetchCreateBill,
    };
  },
};
</script>

<style scoped>
button {
  margin-bottom: 10px;
}
</style>

<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{ userStore.userInfo.itemname || 'User' }}
          <span class="regular"> {{ $t('pages.user.markDay') }}</span>
        </div>
        <img src="@/assets/assets-tencent-logo.png" class="logo" />
      </div>

      <t-card class="user-info-list" :title="$t('pages.user.personalInfo.title')" :bordered="false">
        <template #actions>
          <!-- 编辑按钮
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button> -->
        </template>
        <t-descriptions :column="4" item-layout="vertical">
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.name')">
            {{ userStore.userInfo.itemname }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.id')">
            {{ userStore.userInfo.itemcode }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.email')">
            {{ userStore.userInfo.isemailconfirmed ? '已验证' : '未验证' }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.role')">
            {{ userStore.userInfo.isAdmin ? '管理员' : '普通用户' }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.joinDay')">
            {{ userStore.userInfo.createdate }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.lastLogin')">
            {{ userStore.userInfo.lastloginat }}
          </t-descriptions-item>
          <t-descriptions-item :label="$t('pages.user.personalInfo.desc.status')">
            {{ userStore.userInfo.disable ? '已禁用' : '正常' }}
          </t-descriptions-item>
        </t-descriptions>
      </t-card>

      <t-card class="content-container" :bordered="false">
        <t-tabs value="second">
          <t-tab-panel value="first" :label="$t('pages.user.contentList')">
            <p>{{ $t('pages.user.contentList') }}</p>
          </t-tab-panel>
          <t-tab-panel value="second" :label="$t('pages.user.contentList')">
            <t-card :bordered="false" class="card-padding-no" :title="$t('pages.user.visitData')" describe="（次）">
              <template #actions>
                <t-date-range-picker
                  class="card-date-picker-container"
                  :default-value="LAST_7_DAYS"
                  theme="primary"
                  mode="date"
                  @change="onLineChange"
                />
              </template>
              <div id="lineContainer" style="width: 100%; height: 328px" />
            </t-card>
          </t-tab-panel>
          <t-tab-panel value="third" :label="$t('pages.user.contentList')">
            <p>{{ $t('pages.user.contentList') }}</p>
          </t-tab-panel>
        </t-tabs>
      </t-card>
    </t-col>

    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">Tecul</t-avatar>
        <div class="name">{{ userStore.userInfo.name }}</div>
        <div class="position">{{ userStore.userInfo.isAdmin ? '管理员' : '普通用户' }}</div>
      </t-card>

      <t-card :title="$t('pages.user.teamMember')" class="user-team" :bordered="false">
        <template v-if="userStore.userInfo.isAdmin">
          <t-list v-if="disabledUsers.length" :split="false">
            <t-list-item v-for="(user, index) in disabledUsers" :key="index">
              <t-list-item-meta :title="user.itemname" :description="user.account" />
            </t-list-item>
          </t-list>
        </template>
      </t-card>

      <t-card :title="$t('pages.user.serviceProduction')" class="product-container" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-row class="content" :getters="16">
          <t-col v-for="(item, index) in PRODUCT_LIST" :key="index" :span="3">
            <component :is="getIcon(item)"></component>
          </t-col>
        </t-row>
      </t-card>
    </t-col>
  </t-row>
</template>
<script lang="ts">
export default {
  name: 'UserIndex',
};
</script>
<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { DateRangeValue } from 'tdesign-vue-next';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { T1GetDisabledUsers } from '@/api/user';
import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';
import { useSettingStore, useUserStore } from '@/store';
import { ApiStatusCode } from '@/types/api';
import { handleApiResponse } from '@/utils/apiHelper';
import { changeChartsTheme } from '@/utils/color';
import { LAST_7_DAYS } from '@/utils/date';

import { PRODUCT_LIST } from './constants';
import { getFolderLineDataSet } from './index';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

let lineContainer: HTMLElement;
let lineChart: echarts.ECharts;
const store = useSettingStore();
const chartColors = computed(() => store.chartColors);
const userStore = useUserStore();
const router = useRouter();

const onLineChange = (value: DateRangeValue) => {
  lineChart.setOption(
    getFolderLineDataSet({
      dateTime: value as string[],
      ...chartColors.value,
    }),
  );
};

const initChart = () => {
  lineContainer = document.getElementById('lineContainer');
  lineChart = echarts.init(lineContainer);
  lineChart.setOption({
    grid: {
      x: 30, // 默认是80px
      y: 30, // 默认是60px
      x2: 10, // 默认80px
      y2: 30, // 默认60px
    },
    ...getFolderLineDataSet({ ...chartColors.value }),
  });
};

const updateContainer = () => {
  lineChart?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  });
};

onMounted(() => {
  nextTick(() => {
    initChart();
  });
  window.addEventListener('resize', updateContainer, false);
  fetchDisabledUsers();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

const getIcon = (type: string) => {
  switch (type) {
    case 'a':
      return ProductAIcon;
    case 'b':
      return ProductBIcon;
    case 'c':
      return ProductCIcon;
    case 'd':
      return ProductDIcon;
    default:
      return ProductAIcon;
  }
};

watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([lineChart]);
  },
);

const disabledUsers = ref([]);

const fetchDisabledUsers = async () => {
  if (userStore.userInfo.isAdmin) {
    try {
      const response = await T1GetDisabledUsers();

      handleApiResponse(response, {
        onSuccess: (data) => {
          disabledUsers.value = data || [];
        },
        onError: () => {
          disabledUsers.value = [];
        },
        onSpecificError: {
          [ApiStatusCode.TokenExpired]: () => {
            disabledUsers.value = [];
          },
          [ApiStatusCode.Unauthorized]: () => {
            disabledUsers.value = [];
          },
          [ApiStatusCode.NetworkError]: () => {
            disabledUsers.value = [];
          },
        },
        router,
      });
    } catch (error) {
      console.error('fetchDisabledUsers方法捕捉到没有处理的错误，请检查代码:', error?.message);
      disabledUsers.value = [];
    }
  } else {
    console.error('没有权限访问');
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.t-descriptions {
  margin-top: 24px;
}
</style>

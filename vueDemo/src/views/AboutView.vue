<script setup lang="ts">
import { ref, computed } from 'vue'
import TabTemplate from '../components/TabTemplate.vue'
import TabEvent from '../components/TabEvent.vue'
import TabReactive from '../components/TabReactive.vue'
import TabComputed from '../components/TabComputed.vue'
import TabClassStyle from '@/components/TabClassStyle.vue'
import TabForm from '@/components/TabForm.vue'
import TabWatch from '@/components/TabWatch.vue'
import TabComponent from '@/components/TabComponent.vue'
import TabComposables from '@/components/TabComposables.vue'
import TabRoute from '@/components/TabRoute.vue'
import TabPlugins from '@/components/TabPlugins.vue'


// 定义标签信息，以提高可维护性
const tabList = [
  { name: 'TabTemplate', component: TabTemplate },
  { name: 'TabEvent', component: TabEvent },
  { name: 'TabReactive', component: TabReactive },
  { name: 'TabComputed', component: TabComputed },
  { name: 'TabClassStyle', component: TabClassStyle },
  { name: 'TabForm', component: TabForm },
  { name: 'TabWatch', component: TabWatch },
  { name: 'TabComponent', component: TabComponent },
  { name: 'TabComposables', component: TabComposables },
  { name: 'TabRoute', component: TabRoute },
  { name: 'TabPlugins', component: TabPlugins }
];

// 使用ref绑定当前选中的标签索引，而不是直接绑定标签名
const currentTabIndex = ref(0);

// 计算属性用于获取当前选中的标签信息
const currentTab = computed(() => tabList[currentTabIndex.value]);

// 提供方法来切换标签，增加逻辑控制和异常处理的空间
function switchTab(index: number) {
  if (typeof index !== 'number') {
    throw new TypeError('Expected index to be of type number');
  }
  if (index < 0 || index >= tabList.length) {
    console.error('Invalid tab index');
    return;
  }
  currentTabIndex.value = index;
}
</script>

<template>
  <div class="demo">
    <button v-for="(tab, index) in tabList" :key="tab.name"
      :class="['tab-button', { active: currentTabIndex === index }]" @click="switchTab(index)">
      {{ tab.name }}
    </button>
    <component :is="currentTab.component" class="tab"></component>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.demo {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}

.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}

.tab-button:hover {
  background: #e0e0e0;
}

.tab-button.activeabc {
  background: #e0e0e0;
}

.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>

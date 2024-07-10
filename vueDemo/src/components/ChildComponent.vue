<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import GrandsonComponent from './GrandsonComponent.vue';
import LoadingComponent from './LoadingComponent.vue';
import ErrorComponent from './ErrorComponent.vue';

// defineProps 对父组件开放属性
const props = defineProps(['firstTitle', 'lastTitle'])
// defineEmits 对父组件开放事件
const emit = defineEmits(['update:firstName', 'change:lastName'])

// defineModel 支持多个双向绑定，通过父组件的 v-model 配合来使用
const firstName = defineModel('firstName')  // 组件绑定多个v-model,defineModel里面要有值，否则报错
const lastName = defineModel('lastName')    // 命名规则为camleCase,否则报错
const childModel = defineModel('childModel')
const fullName = computed(() => firstName.value + ' ' + lastName.value)

const AsyncComp = defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(import('./AsyncComponent.vue'))
        }, 6000)
    })
})

const AsyncComp2 = defineAsyncComponent({
    loader: () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(import('./AsyncComponent.vue'))
            }, 3000)
        })
    },
    loadingComponent: LoadingComponent,
    delay: 200,
    timeout: 6000,
    errorComponent: ErrorComponent,
})

</script>

<template>
    <p>验证父子双向绑定（子）：</p>
    <p>修改childmodel值：<input type="text" v-model="childModel">{{ childModel }}</p>
    <p>验证defineProps：</p>
    {{ firstTitle }}：<input type="text" v-model="firstName" @change="emit('update:firstName', $event.target.value)" />
    <!-- 抛出事件，在父组件响应事件-->
    {{ lastTitle }}：<input type="text" v-model="lastName" @change="emit('update:lastName', $event.target.value)" />
    <p>{{ fullName }}</p>
    <GrandsonComponent />
    <p>resolve异步组件,没有动画和占位符：
        <AsyncComp />
    </p>
    <p>启用占位符
        <AsyncComp2 />
    </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// defineProps 对父组件开放属性，defineEmits 对父组件开放事件
const props = defineProps(['firstTitle', 'lastTitle'])
const emit = defineEmits(['update:firstName', 'update:lastName'])

// defineModel 支持双向绑定，通过父组件的 v-model 配合来使用
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
const childmodel = defineModel()
</script>

<template>
    <p>验证父子双向绑定（子）：</p>
    <p>修改childmodel值：<input type="text" v-model="childmodel">{{ childmodel }}</p>
    <p>验证defineProps：</p>
    {{ firstTitle }}：<input type="text" v-model="firstName" />
    {{ lastTitle }}：<input type="text" v-model="lastName" />
</template>

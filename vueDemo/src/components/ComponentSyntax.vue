<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const fathermodel = ref('hello father')
</script>
<template>
    <p>验证父子双向绑定（父）：</p>
    <p>修改fathermodel值：<input type="text" v-model="fathermodel">{{ fathermodel }} </p>
    <p>
        <ChildComponent v-model="fathermodel" firstTitle="姓" lastTitle="名" />
    </p>


</template>
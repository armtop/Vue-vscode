<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { myInjectionKey } from './keys.js'

const abc = inject('message')
const { location, updateLocation } = inject('location')
const dd = inject('read-only-count')
const tt = inject(myInjectionKey)
</script>
<template>
    <div>我是孙子组件</div>
    <p>注入：{{ abc }}</p>
    <p>
        <button @click="updateLocation">{{ location }}</button>
    </p>
    <p>dd:
        {{ dd }}
    </p>
    <p>tt:
        {{ tt }}
    </p>
</template>
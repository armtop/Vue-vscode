<script setup lang="ts">
import { ref } from 'vue'
// 一个组件需要显式声明它所接受的 props，这样 Vue 才能知道外部传入的哪些是 props，哪些是透传 attribute
// 所有的 props 都遵循着单向绑定原则 
const props = defineProps<{
    title?: string
    body?: string
}>()
// defineEmits 对父组件开放事件
defineEmits(['enlarge-text'])

// “透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 v-on 事件监听器
// class、style 和 id 都是透传 attribute
// 如果一个子组件的根元素已经有了 class 或 style attribute，它会和从父组件上继承的值合并
// 如果一个子组件没有声明 class 或 style attribute，它会继承父组件的 class 或 style attribute
// v-on 监听器继承父组件的 v-on 监听器
// 默认情况下，透传 attribute 会被添加到组件的根元素上


</script>

<template>
    <div>
        <slot /> <!-- slot outlet -->
        <h4>{{ title }}</h4>
        <p>{{ body }}</p>
        <button @click="$emit('enlarge-text')">Enlarge text</button>
    </div>
</template>
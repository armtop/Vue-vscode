<script setup lang="ts">
import { ref, watch, watchEffect, watchPostEffect, watchSyncEffect } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)
const qustionnew = ref('')
const qustionold = ref('')
const x = ref(1)
const y = ref(2)
const xnew = ref(0)
const xysum = ref(0)
const watchEff = ref('')


// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
    if (newQuestion.includes('?')) {
        loading.value = true
        answer.value = 'Thinking...'
        qustionnew.value = newQuestion
        qustionold.value = oldQuestion
        try {
            const res = await fetch('https://yesno.wtf/api')
            answer.value = (await res.json()).answer
        } catch (error) {
            answer.value = 'Error! Could not reach the API. ' + error
        } finally {
            loading.value = false
        }
    }
})

// 单个 ref
watch(x, (newX) => {
    console.log('x is ${newX}')
    xnew.value = newX
}, { immediate: true }) // watch 默认是懒执行的：仅当数据源变化时，才会执行回调。immediate: true 选项来强制侦听器的回调立即执行

// getter 函数
watch(() => x.value + y.value, (newX) => {
    console.log('x+y is ${newX}')
    xysum.value = newX
}, { once: true }) // 希望回调只在源变化时触发一次，请使用 once: true 选项

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
    console.log('x is ${newX} and y is ${newY}')
})
// watchEffect只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性.
watchEffect(async () => {
    watchEff.value = `x is ${x.value} and y is ${y.value}`
})

// 回调中能访问被 Vue 更新之后的所属组件的 DOM
watchPostEffect(() => {
    /* 在 Vue 更新后执行 */
})
// 在 Vue 进行任何更新之前触发
watchSyncEffect(() => {
    /* 在响应式数据变化时同步执行 */
})
</script>
<template>
    <p>计算属性允许我们声明性地计算衍生值。然而在有些情况下，我们需要在状态变化时执行一些“副作用”：例如更改 DOM，或是根据异步操作的结果去修改另一处的状态。</p>
    <p>
        Ask a yes/no question:
        <input v-model="question" :disabled="loading" />
    </p>
    <p>{{ answer }}</p>
    <p>newQuestion:{{ qustionnew }}</p>
    <p>oldQuestion:{{ qustionold }}</p>
    <p>Question:{{ question }}</p>
    <p v-if="loading">Loading...</p>
    <p><input v-model="x"> newX:{{ xnew }}</p>
    <p>x + y = {{ xysum }}</p>
    <p>watchEffect:{{ watchEff }}</p>
</template>

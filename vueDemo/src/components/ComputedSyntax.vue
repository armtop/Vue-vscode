<script setup lang="ts">
import { ref, computed } from 'vue'

const author = ref({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性仅会在其响应式依赖更新时才重新计算。
// 这意味着只要 author.books 不改变，无论多少次访问 publishedBooksMessage 都会立即返回先前的计算结果，
// 不用重复执行 getter 函数。
const publishedBooksMessage = computed(() => {
  return author.value.books.length > 0 ? 'Yes' : 'No' }) // 注意，这里使用的是 author.value.books，而不是 author.books

// 下面的计算属性永远不会更新，因为 Date.now() 并不是一个响应式依赖
// const now = computed(() => Date.now())
// 修复：在网页上显示时间并实时更新
const now = ref(new Date().toLocaleString())
setInterval(() => {
  now.value = new Date().toLocaleString()
}, 1000)

// 计算属性默认是只读的。当你尝试修改一个计算属性时，你会收到一个运行时警告。
// 只在某些特殊场景中你可能才需要用到“可写”的属性，可以通过同时提供 getter 和 setter 来创建
const firstName = ref('John')
const lastName = ref('Doe')
const fullName = computed({
  // getter 计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，不要改变其他状态、在 getter 中做异步请求或者更改 DOM！
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>

<template>  
  <p>Has published books:  <span>{{ publishedBooksMessage }}</span>
    <button @click="author.books.pop()">del book</button></p>
  <p>Now:  <span>{{ now }}</span>  </p>
  <P>名：{{ firstName }}  <button @click="firstName = 'huacun'">改名</button></p>
  <P>姓：{{ lastName }}  <button @click="lastName = 'liu'">改姓</button></P>
  <p>姓名：{{ fullName }}  <button @click="fullName = 'tom lhc'">修改</button></p>
</template>
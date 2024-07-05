<script setup>
import { ref } from 'vue'

const count = ref(0)
const model = defineModel()
function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}

defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
  <h5>
    <slot name="sh5"></slot>
  </h5>
  <button @click="count++">You clicked me {{ count }} times.</button>
  <div>Parent bound vmodel is: <input type="text" v-model="model">{{ model }}</div>

  <div class="container">
    <header>
      <slot name="header1"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer1"></slot>
    </footer>
  </div>
</template>

<style>
footer {
  border-top: 1px solid #ccc;
  color: #666;
  font-size: 0.8em;
}
</style>
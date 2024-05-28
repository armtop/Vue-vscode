<script setup>
import { ref } from 'vue'
defineProps(['title'])
const count = ref(0)

const model=defineModel()

</script>

<template>
      <h4>{{ title }}</h4>
  <button @click="count++">You clicked me {{ count }} times.</button>
  <div>Parent bound vmodel is: <input type="text" v-model="model" ></div>
</template>
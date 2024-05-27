<script setup>
import { ref } from 'vue'
defineProps(['title'])
const count = ref(0)
</script>

<template>
      <h4>{{ title }}</h4>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
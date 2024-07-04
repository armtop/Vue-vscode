<script setup lang="ts" >
import { ref,computed } from 'vue'

const isActive = ref(false)
const color = ref(true)

const classObject = computed(() => ({
  active: !isActive.value ,
  'color: green': color.value
}))

</script>

<template>
<div class="static" >static</div>
<div  :class="{ active: isActive }">active: {{isActive}}
    <button @click="isActive = !isActive">Toggle</button>
</div>
<div :class="classObject">classObject</div>
</template>

<style>

.static {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}

.active{
  color: red;
  background: #f0f0f0;
}

.tab-button:hover {
  background: #e0e0e0;
}

.tab-button.active {
  background: #e0e0e0;
}

.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>

<script setup lang="ts" >
import { ref,computed } from 'vue'

const isActive = ref(false)
const color = ref(true)

const classObject = computed(() => ({
  active: !isActive.value ,
  'color: green': color.value
}))

const activeColor = ref('red')
const fontSize = ref(30)
const styleObject = ref({
  color: 'green'
})
const styleObject2 = ref({
  fontSize: '20px'
})
</script>

<template>
<div class="static" >static</div>
<div  :class="{ active: isActive }">active: {{isActive}}
    <button @click="isActive = !isActive">Toggle</button>
</div>
<div :class="classObject">classObject</div>
<!-- :class 更适合用于切换多个预定义的 CSS 类，而 :style 则更适合用于动态设置具体的 CSS 属性值 -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }">style</div>
<div :style="styleObject">styleObject</div>
<div :style="[styleObject, styleObject2]">style数组</div>
<div :style="{ 'font-size': fontSize + 'px' }">style string </div>

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
</style>

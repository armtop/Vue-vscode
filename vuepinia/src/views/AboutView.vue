<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()

counter.count++  // count的值为1
counter.$patch({ count: counter.count + 1 }) // 修改属性值，count的值为2
counter.$reset() // 重置为初始值,count的值为0
counter.increment() // count的值为1
counter.count++

// 订阅counter的变化，detached为true表示在组件销毁时自动取消订阅
counter.$subscribe((count) => {
  //count.value
  //console.log("count的值发生变化:" + count.value)
}, { detached: true })

watch(counter, async (newValue, oldValue) => {
  console.log("watch观察到count的值发生变化:" + newValue.count + "--" + oldValue.count)
})

</script>
<template>
  <div class="about">
    Current Count:{{ counter.count }}
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

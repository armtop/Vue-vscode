<script setup lang="ts">
import { ref,nextTick  } from 'vue'
import type { Ref } from 'vue'

const countA = ref(0)
const nub = {id:ref(1)}

function increment() {
  countA.value++
}

// 为 ref 内的值指定一个更复杂的类型，可以通过使用 Ref 这个类型
const year: Ref<string | number> = ref('2020')
year.value = 2020
// 或者在调用 ref() 时传入一个泛型参数，来覆盖默认的推导行为
const year2 = ref<string | number>('2020')
year2.value = 2020

// 复杂对象
const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})
async function mutateDeeply() {
  // 注意，此时修改对象时： obj.value.nested
  obj.value.nested.count++
  console.log("nextTick前"+document.getElementById('btcount')?.textContent||'Element not found')
  console.log("nextTick前"+document.getElementById('btarr')?.textContent||'Element not found')
  // Vue 会在“next tick”更新周期中缓冲所有状态的修改，
  // 以确保不管你进行了多少次状态修改，每个组件都只会被更新一次。
  await nextTick()
  // 现在 DOM 已经更新了
  obj.value.arr.push('baz'+obj.value.nested.count)
  console.log(document.getElementById('btcount')?.textContent||'Element not found')
  console.log(document.getElementById('btarr')?.textContent||'Element not found')
}
</script>

<template>
<p>
   <button id="btcount" @click="mutateDeeply">
    <!--注意，此时绑定对象时： obj.nested-->
    {{ obj.nested.count }}
  </button>
</p>
<p>
  <button id="btarr" @click="mutateDeeply">
    <!--模板中使用了一个 ref，然后改变了这个 ref 的值时，Vue 会自动检测到这个变化，并且相应地更新 DOM-->
    {{obj.arr}}
  </button>
</p>
<p>
    <!--在模板渲染上下文中，只有顶级的 ref 属性才会被解包-->
    {{ countA + 5 }}
    <!--{{ nub.id + 1 }} 会报错-->
    {{ nub.id.value + 4 }}
</p>

</template>
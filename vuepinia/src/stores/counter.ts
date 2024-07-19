import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 组合式函数，use开头
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const hasChanged = ref(true)
  const state = ref({} as State)

  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  // 在 Setup Stores 中，您需要创建自己的 $reset() 方法
  function $reset() {
    count.value = 0
    hasChanged.value = true
  }
  // 返回Store属性和方法，注意不要返回route和appProvided之类的属性，它们不属于Store
  return { count, hasChanged, state, doubleCount, increment, $reset }
})

interface UserInfo {
  name: string
  age: number
  isAdmin: boolean
}

interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

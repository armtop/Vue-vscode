// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'


/**
 * 使用鼠标位置的自定义钩子。
 * 
 * 该函数提供了一个用于跟踪鼠标位置的钩子。它监听窗口的mousemove事件，
 * 并更新提供的ref对象以反映鼠标在页面上的当前横坐标和纵坐标。
 * 
 * @returns {Object} 返回一个对象，包含x和y两个属性，这两个属性都是Ref对象，
 *                   可以用于响应式地获取鼠标在页面上的当前位置。
 */
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
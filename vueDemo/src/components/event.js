import { onMounted, onUnmounted } from 'vue'

/**
 * 使用自定义hook来管理事件监听器。按照惯例，组合式函数名以“use”开头
 * 这个函数的主要目的是在组件挂载时添加一个事件监听器，并在组件卸载时移除它。
 * 这样做可以确保事件监听器只在组件生命周期内有效，避免了潜在的内存泄漏问题。
 * 
 * @param {Object} target - 目标元素或者对象，需要在其上添加事件监听器。
 * @param {String} event - 需要监听的事件名称。
 * @param {Function} callback - 事件被触发时执行的回调函数。
 */
export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
/**
 * 副作用​
在组合式函数中的确可以执行副作用 (例如：添加 DOM 事件监听器或者请求数据)，但请注意以下规则：
    如果你的应用用到了服务端渲染 (SSR)，请确保在组件挂载后才调用的生命周期钩子中执行 DOM 相关的副作用，
    例如：onMounted()。这些钩子仅会在浏览器中被调用，因此可以确保能访问到 DOM。

    确保在 onUnmounted() 时清理副作用。举例来说，如果一个组合式函数设置了一个事件监听器，
    它就应该在 onUnmounted() 中被移除 (就像我们在 useMouse() 示例中看到的一样)。
    当然也可以像之前的 useEventListener() 示例那样，使用一个组合式函数来自动帮你做这些事。
 */
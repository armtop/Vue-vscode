<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const inputText = ref('')

function greet(event) {
  alert(`Hello ${count.value}!`)
  // `event` 是 DOM 原生事件
  if (event) {
    alert(event.target.tagName)
  }
}
function handleChange(event: Event) {
  // 如果不定义类型，`event` 隐式地标注为 `any` 类型
  inputText.value = (event.target as HTMLInputElement).value
  //console.log((event.target as HTMLInputElement).value)
}
function say(message) {
  alert(message)
}
function warn(message, event) {
  // 这里可以访问原生事件
  if (event) {
    event.preventDefault()
    alert(event.target.tagName)
  }
  alert(message)
}
</script>

<template>
  <p>
    <!-- 方法与内联事件判断,通过检查 v-on 的值是否是合法的 JavaScript 标识符或属性访问路径来断定是何种形式的事件处理器。
     举例来说，foo、foo.bar 和 foo['bar'] 会被视为方法事件处理器，
     而 foo() 和 count++ 会被视为内联事件处理器。 -->
  </p>
  <P>
    <!-- v-on 简写@ 内联事件处理器通常用于简单场景 -->
    <button @click="count++">Add 1 : {{ count }}</button>
  </p>
  <P>
    <!-- 内联事件处理器，调用方法 -->
    <button @click="say('hello')">Say hello</button>
  </p>
  <P>
    <!-- 内联事件处理器，访问事件参数 -->
    <button @click="warn('Form cannot be submitted yet.', $event)">
      Submit
    </button>
  </p>
  <p>
    <!-- 方法事件处理器，访问事件处理函数 -->
    <button @click="greet">Greet</button>
  </p>
  <p>
    <!-- 方法事件处理器，处理原生 DOM 事件时，应该为我们传递给事件处理函数的参数正确地标注类型 -->
    <input type="text" @change="handleChange" />{{ inputText }}
  </p>
  <p>
    <!-- 事件修饰符，点击事件最多被触发一次 -->
    <button @click.once="count++">只能调用一次 : {{ count }}</button>
  </p>
  <p>
    <!-- 事件修饰符，仅在 `key` 为 `Enter` 时调用 `submit` -->
    <input type="text" @keyup.enter="handleChange" />仅按回车提交：{{ inputText }}
  </p>
  <P>
    <!-- 事件修饰符， 需要按下 Ctrl 时才执行-->
    <button @click.ctrl="say('hello')">按Ctrl并点击执行 </button>
  </p>
</template>
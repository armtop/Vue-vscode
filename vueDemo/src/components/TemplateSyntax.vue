<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello World!')
const rawHtml = ref('<span style="color: red;">This should be red</span>')
const imageSrc = ref('https://img.51miz.com/Element/00/78/97/54/5fd1f136_E789754_21cb0c49.png')
const key = ref('disabled')
const value = ref(false)
const isRed = ref(true)
const objectOfAttrs = {
    id: 'container',
    class: 'wrapper'
}
const number = ref(0)
const ok = ref(true)

const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
const myObject = ref({
    title: 'How to do lists in Vue',
    author: 'Jane Doe',
    publishedAt: '2016-04-10'
})
const todos = ref([
    {
        id: 1,
        title: 'Do the dishes'
    },
    {
        id: 2,
        title: 'Take out the trash'
    },
    {
        id: 3,
        title: 'Mow the lawn'
    }
])
const currenttype =ref('A')
const cycleType=()=> {
      // 使用数组来简化循环逻辑，数组中包含所有可能的type值
      const types = ['A', 'B', 'C', 'D'];
      
      // 找到当前type值在数组中的索引，如果不存在，则默认为0
      const currentIndex = types.indexOf(currenttype.value);
          
      // 循环到下一个值，如果已经是最后一个则回到第一个
      var nextIndex = (currentIndex + 1) % types.length;
      
      // 更新currentType的值
    currenttype.value = types[nextIndex];
}
</script>

<template>
    <!-- 内置指令 -->
    <p>使用 v-text 指令：<span v-text="msg"></span></p>
    <!-- 等同于 -->
    <p><span>Message:{{ msg }}</span></p>
    <p>使用 v-html 指令：<span v-html="rawHtml"></span></p>
    <p>使用文本插值：{{ rawHtml }}</p>
    <p>使用 v-show 指令，v-show 不支持在 template 元素上使用，也不能和 v-else 搭配使用：
        <span v-show="ok">ok is {{ ok }}</span>
        <button @click="ok = !ok">Toggle</button></p>
    <p>使用 v-if 指令：
        <span v-if="ok">Vue is awesome!</span>
        <span v-else>Oh no 😢</span>
        <button @click="ok = !ok">Toggle</button></p>
    <p>使用 v-else-if 指令： 
        <button @click="cycleType">Toggle</button>
        <div v-if="currenttype === 'A'">
        A
        </div>
        <div v-else-if="currenttype === 'B'">
        B
        </div>
        <div v-else-if="currenttype === 'C'">
        C
        </div>
        <div v-else>
        Not A/B/C
        </div>
    </p>
    <p>在template使用 v-if 指令：
        <template v-if="ok">
            <h1>Title</h1>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
        </template>
    </p>
    <p>使用 v-for 指令：
        <li v-for="(item, index) in items">
            {{ parentMessage }} - {{ index }} - {{ item.message }}
        </li>
    </p>
    <p>v-for 遍历一个对象的所有属性：
        <li v-for="(value, key, index) in myObject">
            {{ index }}. {{ key }}: {{ value }}
        </li>
    </p>
    <p>在 v-for 里使用范围值：
        <li v-for="n in 5">{{ n }}</li>
    </p>
    <p>在 template 标签上使用 v-for：
    <ul>
        <template v-for="item in items">
            <li>{{ item.message }}</li>
        </template>
    </ul>
    </p>
    <p>为每个元素对应的块提供一个唯一的 key attribute：
        <template v-for="todo in todos" :key="todo.id">
            <li>{{ todo.title }}</li>
        </template>
    </p>


    <!-- 绑定 attribute -->
    <img v-bind:src="imageSrc" width="100" height="100" />

    <!-- 动态 attribute 名，注意key和value是变量 -->
    <p><button v-bind:[key]="value">动态按钮属性</button></p>

    <!-- class 绑定 -->
    <div :class="{ red: isRed }">class 绑定</div>

    <!-- 动态绑定多个值 -->
    <div :id="objectOfAttrs.id" :class="objectOfAttrs.class"></div>
    <!-- 简写 -->
    <div v-bind="objectOfAttrs">动态绑定多个值</div>

    <!-- 使用 JavaScript 表达式 -->
    <p>{{ number + 1 }}</p>
    <p>{{ msg.split('').reverse().join('') }}</p>
</template>
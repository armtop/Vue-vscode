<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import ChildComponent from './ChildComponent.vue'
import BlogPost from './BlogPost.vue';
import { myInjectionKey } from './keys.js'

const first = ref('John')
const last = ref('Doe')
const fathermodel = ref('hello father')
const posts = ref([
    { id: 1, title: 'My journey with Vue', body: 'This is my journey with Vue' },
    { id: 2, title: 'Blogging with Vue', body: 'Vue is awesome' },
    { id: 3, title: 'Why Vue is so fun', body: 'It just so so' }
])
const postFontSize = ref(1)
// 监听ChildComponent子组件的事件
const updateParent = () => {
    alert('updateParent')
}
const changeParent = () => {
    alert('changeParent')
}

// 解决prop 逐级透传
const message = ref('hello')
provide(/* 注入名 */ 'message', /* 值 */ message)
// 在整个应用层面提供依赖 app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')

const location = ref('North Pole')

function updateLocation() {
    location.value = 'South Pole'
}
// 注入函数
provide('location', {
    location,
    updateLocation
})

// 数据不能被注入方的组件更改
const count = ref(100)
provide('read-only-count', readonly(count))


provide(myInjectionKey, 'symbol value')
</script>
<template>
    <p>验证父子双向绑定（父）：</p>
    <p>修改fathermodel值：<input type="text" v-model="fathermodel">{{ fathermodel }} </p>
    <p> 通过v-model绑定子组件的值，通过父组件的v-model更新子组件的值，实现双向绑定
        <!--监听ChildComponent子组件的事件-->
        <ChildComponent v-model:child-model="fathermodel" firstTitle="姓" lastTitle="名" v-model:first-name="first"
            v-model:last-name="last" @update:firstName="updateParent" @update:lastName="changeParent" />
    </p>
    <p>
        验证prop对象动态绑定：
    <div :style="{ fontSize: postFontSize + 'em' }">
        <BlogPost v-for="post in posts" :key="post.id" v-bind="post" @enlarge-text="postFontSize += 0.1">
            slot测试，插槽内容可以是任意合法的模板内容，不局限于文本
        </BlogPost>
    </div>
    </p>
    <p>
        修改注入值：<input type="text" v-model="message">
    </p>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useMouse } from './mouse'  // 添加了mouse.d.ts类型说明文件，可以不用使用mouse.js
import { useFetch } from './fetch'
import { useLocalStorage, usePreferredDark } from '@vueuse/core';

const { x, y } = useMouse()
const d = ref(0)
const e = ref('')
const url = ref('https://yesno.wtf/api')
const api = ref('')
const { data, loading, error } = useFetch(url)
const store = useLocalStorage(
    'my-storege',
    {
        name: 'apple',
        color: 'red',
    }
)

// artificial delay
function timeout() {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            d.value = Math.random()
            if (d.value > 0.3) {
                e.value = 'ok'
                resolve()
            } else {
                e.value = 'Error'
                reject(new Error('Random Error'))
            }
        }, 300)
    })
}

const a = ref('')
const b = ref()
function test() {
    try {
        timeout()
        a.value = 'success'
    } catch (e) {
        b.value = e
    }
}
</script>
<template>
    Mouse position is at: {{ x }}, {{ y }}
    <p>
        调用API接口
        <input v-model="api" />
        <button @click="url = 'https://yesno.wtf/api/?' + api">Reset</button>
        {{ url }}
    </p>
    <p>
        {{ loading ? 'loading...' : data ? data.answer : 'error' }}
        <span v-if="error">{{ error }}</span>
    </p>
    <p>
        {{ data }}
    </p>
    <p><button @click="test">随机测试</button></p>
    <p>d:{{ d }}</p>
    <p>e:{{ e }}</p>
    <p>a:{{ a }}</p>
    <p>b:{{ b }}</p>
</template>
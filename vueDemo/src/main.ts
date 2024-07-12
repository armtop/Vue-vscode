import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18nPlugin from './plugins/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 安装国际化插件
app.use(i18nPlugin, {
    // 翻译字典
    greetings: {
        hello: '你好',
        world: '世界'
    }
})

app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import axios from './lib/axios'
import $eventBus from './bus/bus.js'
import 'ant-design-vue/dist/antd.css'
const app = createApp(App).use(store).use(router).use(Antd)
app.config.globalProperties.$eventbus = $eventBus
app.config.globalProperties.$axios = axios
app.config.performance = true
app.mount('#app')

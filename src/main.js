import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button, Input, Layout, Modal, Form, Select } from 'ant-design-vue'
import axios from './lib/axios'
import $eventBus from './bus/bus.js'
// import * as Sentry from '@sentry/browser'
// import { Integrations } from '@sentry/tracing'
import 'moment/locale/zh-cn'
// import 'ant-design-vue/dist/antd.css'
const app = createApp(App).use(store).use(router)
app.config.globalProperties.$eventbus = $eventBus
app.config.globalProperties.$axios = axios
app.config.performance = true
app.component('a-button', Button)
app.component('a-input', Input)
app.component('a-input-password', Input.Password)
app.component('a-textarea', Input.TextArea)
app.component('a-layout', Layout)
app.component('a-layout-content', Layout.Content)
app.component('a-layout-header', Layout.Header)
app.component('a-layout-sider', Layout.Sider)
app.component('a-modal', Modal)
app.component('a-form', Form)
app.component('a-form-item', Form.Item)
app.component('a-select', Select)
app.component('a-select-option', Select.Option)
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// if (process.env.NODE_ENV.NODE_ENV !== 'development') {
//   Sentry.init({
//     dsn: 'https://a6d987db30b74ef2b32f6caab57290f8@o563314.ingest.sentry.io/5703183',
//     integrations: [new Integrations.BrowserTracing()],
//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0
//   })
// }
app.mount('#app')

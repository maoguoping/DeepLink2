import axios from './axios'
import api from './interface'
import { pMonitor } from './pm'
export default {
  install: (Vue: any, options: any) => {
    // 挂载实例
    Vue.prototype.$axios = axios
    Vue.prototype.$api = api
    pMonitor.initPm()
  }
}

import { createStore } from 'vuex'
import platform from './platformStore'
import headerBar from './headerBarStore'
import manageCenterStore from './manageCenterStore'
export default createStore({
  state: {
    a: 'ss'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    platform: platform,
    headerBar: headerBar,
    manageCenterStore: manageCenterStore
  }
})

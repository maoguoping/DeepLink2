import { createStore } from 'vuex'
import platform, { PlatformStore } from './platformStore'
import headerBar, { HeaderBarStore } from './headerBarStore'
export interface State {
  platform: PlatformStore,
  headerBar: HeaderBarStore
}
export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    platform: platform,
    headerBar: headerBar
  }
})

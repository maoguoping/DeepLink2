import { createStore } from 'vuex'
import platform, { PlatformStore } from './platformStore'
import headerBar, { HeaderBarStore } from './headerBarStore'
export interface State {
  platform: PlatformStore,
  headerBar: HeaderBarStore
}
export interface Store {
  platform: PlatformStore,
  headerBar: HeaderBarStore
}
const store = createStore({
  mutations: {
  },
  actions: {
  },
  modules: {
    platform: platform,
    headerBar: headerBar
  }
})
export default store
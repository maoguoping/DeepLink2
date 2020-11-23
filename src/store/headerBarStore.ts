interface State {
  headerBarCurrentMenu: string
}
export interface HeaderBarStore {
  state: State
  getters: any
  mutations: any
  actions: any
}
export default {
  state: {
    headerBarCurrentMenu: '/index'
  },
  mutations: {
    changeHeaderBarCurrentMenu (state: State, path: string) {
      state.headerBarCurrentMenu = path
    }
  }
}

import axios from '../lib/axios'
import interfaceUrl from '../lib/interface'
import router from '../router'
import { Commit } from 'vuex'
interface State {
  isLogin: Boolean
  token: string
  currentUser: any
  userInfo: any
  pageAccessList: any[]
}
export interface PlatformStore {
  state: State
  getters: any
  mutations: any
  actions: any
}
export default {
  state: {
    isLogin: false,
    token: localStorage.getItem('token') || '',
    currentUser: { username: localStorage.getItem('username') } || null,
    userInfo: {
      createTime: '',
      lastLoginTime: '',
      loginCount: 0,
      roleId: 1,
      roleName: '',
      status: '',
      userId: '',
      userTickName: '',
      username: ''
    },
    pageAccessList: []
  },
  getters: {
    isAdmin (state: any) {
      let roleId = state.userInfo ? state.userInfo.roleId : 1
      return roleId === 0
    }
  },
  mutations: {
    /**
     * 更改用户状态信息
     * @param state
     * @param user
     */
    userStatus (state: any, user: any) {
      if (user) {
        state.currentUser = user
        state.isLogin = true
      } else if (user === null) {
        // 登出清空localStorage
        localStorage.setItem('username', '')
        localStorage.setItem('token', '')
        state.currentUser = null
        state.isLogin = false
        state.token = ''
      }
    },
    /**
     *
     * @param state
     * @param token
     */
    userToken (state: any, token: string) {
      state.token = token
    },
    /**
     *
     * @param state
     * @param userInfo
     */
    userInfo (state: any, userInfo: any) {
      state.userInfo = userInfo
    },
    setPageAcceessList (state: any, list: any) {
      console.log('setPageAcceessList', list)
      state.pageAccessList = list
    },
    clearUserInfo (state: any) {
      state.userInfo = {
        createTime: '',
        lastLoginTime: '',
        loginCount: 0,
        roleId: 1,
        roleName: '',
        status: '',
        userId: '',
        userTickName: '',
        username: ''
      }
    }
  },
  actions: {
    setUser (context: { commit: Commit }, user: any) {
      context.commit('userStatus', user)
    },
    setToken (context: { commit: Commit }, token: string) {
      context.commit('userToken', token)
    },
    async setUserInfo (context: { commit: Commit }) {
      let res: any = await axios.get(interfaceUrl.users.loginStatus, {})
      context.commit('userInfo', res.userInfo)
    },
    async getPageAcceessList (context:{ commit: Commit, state: State }) {
      let res = await axios.post(interfaceUrl.users.getPageAcceessList, {
        userId: context.state.userInfo.userId
      })
      console.log(res)
      context.commit('setPageAcceessList', res.data)
    },
    async logout (context: { commit: Commit }, callback: any) {
      let res = null
      try {
        await axios.post(interfaceUrl.users.logout)
        context.commit('userStatus', '')
        context.commit('userToken', '')
        context.commit('clearUserInfo')
        context.commit('setPageAcceessList', [])
        localStorage.setItem('username', '')
        localStorage.setItem('token', '')
        res = { success: true, message: '推出成功' }
      } catch (err) {
        res = { success: false, message: err.message }
      }
      if (callback && typeof callback === 'function') {
        callback(res)
      } else {
        if (res.success) {
          router.push({
            path: '/login'
          })
        }
      }
    }
  }
}

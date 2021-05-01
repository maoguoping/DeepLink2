import axios from '../lib/axios'
import interfaceUrl from '../lib/interface'
export default {
  state: {
    manageCenterPath: '',
    manageCenterPathId: '',
    manageCenterPathType: '',
    manageCenterPathInfo: [
      {
        label: '管理中心',
        value: ''
      }
    ],
    manageCenterInfo: null
  },
  mutations: {
    setManageCenterInfo (state, info) {
      state.manageCenterInfo = info
    },
    setManageCenterPathInfo (state, info) {
      state.manageCenterPath = info.pathName
      state.manageCenterPathId = info.pathId
      state.manageCenterPathType = info.type
    }
  },
  actions: {
    async changeManageCenterPath ({ commit, state }, { pathId, type }) {
      const res = await axios.post(interfaceUrl.manageCenter.getInfoByPathId, {
        pathId: pathId
      })
      const tempData = res.data ? res.data : null
      // let path=pathName?pathName:"";
      // let length=path.split('/').length;
      // 项目
      console.log('最新数据', tempData)
      commit('setManageCenterInfo', tempData)
      const pathName = tempData ? tempData.path : ''
      commit('setManageCenterPathInfo', {
        pathName,
        pathId,
        type
      })
      const idArr = pathId.slice(1).split('/')

      const nameArr = pathName.slice(1).split('/')

      const output = [{
        label: '管理中心',
        value: ''
      }]
      if (pathId) {
        for (let i = 0; i < idArr.length; i++) {
          output.push({
            label: nameArr[i],
            value: idArr[i]
          })
        }
      }
      state.manageCenterPathInfo = output
    }
  }
}

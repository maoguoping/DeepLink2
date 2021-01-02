import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
export const useRoleListDic = function () {
  const roleList = ref([])
  const getRoleListDic = async () => {
    try {
      const res = await $axios.get($api.api.getRoleListDic, {})
      roleList.value = res.data
    } catch (err) {
      message.error('加载角色下拉列表失败')
    }
  }
  onMounted(async () => {
    console.log('onMounted getRoleListDic')
    await getRoleListDic()
  })
  return {
    roleList,
    getRoleListDic
  }
}
export const useElementTypeDic = function () {
  const elementTypeList = ref([])
  const getElementTypeDic = async () => {
    try {
      const res = await $axios.get($api.api.getElementTypeDic, {})
      elementTypeList.value = res.data
    } catch (err) {
      message.error('加载元素类别列表失败')
    }
  }
  return {
    elementTypeList,
    getElementTypeDic
  }
}
export const useFolderTypeDic = function () {
  const folderTypeList = ref([])
  const getFolderTypeDic = async () => {
    try {
      const res = await $axios.get($api.api.getFolderTypeDic, {})
      folderTypeList.value = res.data
    } catch (err) {
      message.error('加载目录类别列表失败')
    }
  }
  return {
    folderTypeList,
    getFolderTypeDic
  }
}

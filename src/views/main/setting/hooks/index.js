import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
// 角色下拉选择数据
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
// 搜索表单
export const useSearchForm = function (initFormdata) {
  const form = reactive(initFormdata)
  const initTmpFormData = { ...initFormdata }
  const resetForm = () => {
    Object.keys(initTmpFormData).forEach(key => {
      form[key] = initTmpFormData[key]
    })
  }
  return {
    form,
    resetForm
  }
}
// 详情弹框
export const useDetailModal = function (initType) {
  const show = ref(false)
  const type = ref(initType)
  const info = ref({})
  const openModal = (openType) => () => {
    type.value = openType
    show.value = true
  }
  const openInfoModal = (openType) => (openInfo) => {
    if (openInfo !== undefined) {
      info.value = openInfo
    }
    type.value = openType
    show.value = true
  }
  return {
    show,
    type,
    info,
    openModal,
    openInfoModal
  }
}

import { ref, onMounted, reactive } from 'vue'
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
export const usePage = function (cb) {
  const page = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    list: [10, 20, 30, 40]
  })
  const handleSizeChange = (current, size) => {
    console.debug('切换size', current, size)
    page.pageSize = size
    page.currentPage = 1
    cb()
  }
  const handleCurrentChange = (current) => {
    page.currentPage = current
    cb()
  }
  return {
    page,
    handleSizeChange,
    handleCurrentChange
  }
}
export const useTableSort = function (colName, order, cb) {
  const sortCol = ref(colName)
  const sortOrder = ref(order)
  const handleSortChange = (params) => {
    const { prop, order } = params
    let sortOrder = ''
    order === 'ascending' ? sortOrder = 'ASC' : sortOrder = 'DESC'
    sortCol.value = prop
    sortOrder.value = sortOrder
    cb()
  }
  return {
    sortCol,
    sortOrder,
    handleSortChange
  }
}

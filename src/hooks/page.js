import { reactive } from 'vue'
// 分页加载
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
  const loadPage = () => {
    page.currentPage = 1
    cb()
  }
  return {
    page,
    loadPage,
    handleSizeChange,
    handleCurrentChange
  }
}

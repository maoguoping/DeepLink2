import { ref } from 'vue'
// 表格排序
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

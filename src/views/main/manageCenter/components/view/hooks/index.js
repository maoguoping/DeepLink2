import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { watch, onMounted } from 'vue'
import Utils from '@/lib/utils.js'
export const useView = function (emit, page, defaultLoad, updateFn) {
  const router = useRouter()
  const store = useStore()
  // 查看
  const handleRead = (item) => {
    emit('view-read', item)
    console.log('view-read', item)
    page.currentPage = 1
    store.dispatch('changeManageCenterPath', {
      pathId: item.pathId,
      pathName: decodeURI(item.path),
      type: item.type
    })
    router.push({
      path: '/manageCenter',
      query: {
        pathId: Utils.pathStrEncode(item.pathId),
        type: item.type
      }
    })
  }
  // 编辑下拉框
  const handleCommand = ({ key }, record) => {
    console.log(key, record)
    emit(key, record)
  }
  watch(defaultLoad, (val) => {
    console.log('defaultLoad', val)
    val && updateFn()
  })
  onMounted(() => {
    //            var path=""
  //            if(manageCenterName!=this.pathStr){
  //                path=this.pathStr;
  //            }
  //            this.   (path);
    console.log('mounted', defaultLoad)
    defaultLoad.value && updateFn()
  })
  return {
    handleRead,
    handleCommand
  }
}

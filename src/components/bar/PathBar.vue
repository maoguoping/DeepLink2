<template>
  <div class="path-bar">
    <div class="breadcrumb-box">
      <a-breadcrumb separator-class="a-icon-arrow-right">
        <a-breadcrumb-item v-for="(item,index) in pathData" :key="item.value">
          <a @click="pathLinkTo(index)">{{item.label}}</a>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
  </div>
</template>

<script>
import { Breadcrumb } from 'ant-design-vue'
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Utils from '@/lib/utils.js'
export default {
  name: 'path-bar',
  props: {
    // 路径切换之前
    beforeChange: {
      type: Function,
      required: false,
      default: () => {
        return true
      }
    }
  },
  setup (props, { emit }) {
    const { beforeChange } = toRefs(props)
    const store = useStore()
    const router = useRouter()
    const pathStr = computed(() => store.state.manageCenterStore.manageCenterPath)
    const pathId = computed(() => store.state.manageCenterStore.manageCenterPathId)
    const pathData = computed(() => store.state.manageCenterStore.manageCenterPathInfo)
    const changeManageCenterPath = (pathInfo) => store.dispatch('changeManageCenterPath', pathInfo)
    const pathChange = (pathStr) => {
      let docPath = []
      if (pathStr) {
        docPath = pathStr.split('/')
        docPath[0] = '管理中心'
      } else {
        docPath = ['管理中心']
      }
      return docPath
    }
    /**
       * 从组件内部调用链接地址切换
       * @param index {Number}
       */
    const pathLinkTo = (index) => {
      let pathId = ''

      let pathName = ''
      if (index === 0) {
        pathName = '管理中心'
      } else {
        pathData.value.slice(1, index + 1).forEach(item => {
          pathId += `/${item.value}`
          pathName += `/${item.label}`
        })
      }
      // 链接是否可以点击默认为
      if (beforeChange.value(pathName)) {
        changeManageCenterPath({
          pathId: pathId,
          pathName: pathName,
          type: 1
        })
        router.push({
          path: '/manageCenter',
          query: {
            pathId: Utils.pathStrEncode(pathId),
            type: 1
          }
        })
        emit('path-link-to', { pathId: pathId, pathName: pathName, type: 1 })
      }
    }
    /**
       * 从父组件调用链接地址切换
       * @param pathId {String} 路径id
       * @param pathName  {String} 路径文本
       */
    const changePathTo = async (pathId, pathName) => {
      await changeManageCenterPath({
        pathId,
        type: ''
      })
      router.push({
        path: '/manageCenter',
        query: {
          pathId: Utils.pathStrEncode(pathId)
        }
      })
      emit('path-link-to', name)
    }
    return {
      pathStr,
      pathId,
      pathData,
      changeManageCenterPath,
      pathChange,
      pathLinkTo,
      changePathTo
    }
  },
  components: {
    'a-breadcrumb': Breadcrumb,
    'a-breadcrumb-item': Breadcrumb.Item
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .path-bar {
    .breadcrumb-box {
      margin: 8px 0px;
    }
  }

  a {
    text-decoration: none;
  }
</style>

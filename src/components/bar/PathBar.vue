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
import { mapState, mapActions } from 'vuex'
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
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      pathStr: state => state.manageCenterStore.manageCenterPath,
      pathId: state => state.manageCenterStore.manageCenterPathId,
      pathData: state => state.manageCenterStore.manageCenterPathInfo
    })
  },
  created: function () {
  },
  methods: {
    ...mapActions([
      'changeManageCenterPath'
    ]),
    /**
       *路径字符串转路径数组
       * @param pathStr
       */
    pathChange (pathStr) {
      let docPath = []
      if (this.pathStr) {
        docPath = this.pathStr.split('/')
        docPath[0] = '管理中心'
      } else {
        docPath = ['管理中心']
      }
      return docPath
    },
    /**
       * 从组件内部调用链接地址切换
       * @param index {Number}
       */
    pathLinkTo (index) {
      let pathId = ''

      let pathName = ''
      if (index === 0) {
        pathName = '管理中心'
      } else {
        this.pathData.slice(1, index + 1).forEach(item => {
          pathId += `/${item.value}`
          pathName += `/${item.label}`
        })
      }
      // 链接是否可以点击默认为
      if (this.beforeChange(pathName)) {
        this.changeManageCenterPath({
          pathId: pathId,
          pathName: pathName,
          type: 1
        })
        this.$router.push({
          path: '/manageCenter',
          query: {
            pathId: Utils.pathStrEncode(pathId),
            type: 1
          }
        })
        this.$emit('path-link-to', { pathId: pathId, pathName: pathName, type: 1 })
      }
    },
    /**
       * 从父组件调用链接地址切换
       * @param pathId {String} 路径id
       * @param pathName  {String} 路径文本
       */
    async changePathTo (pathId, pathName) {
      await this.changeManageCenterPath({
        pathId: pathId,
        type: ''
      })
      this.$router.push({
        path: '/manageCenter',
        query: {
          pathId: Utils.pathStrEncode(pathId)
        }
      })
      this.$emit('path-link-to', name)
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

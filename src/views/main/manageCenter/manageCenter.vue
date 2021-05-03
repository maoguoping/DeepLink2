<template>
    <a-layout class="mangerCenter">
        <a-layout-header class="mangerCenterHeader " style="height: 30px;background-color: #f0f2f5">
            <PathBar ref="pathBar" :beforeChange="beforePathChange" @path-link-to="pathLinkTo"></PathBar>
        </a-layout-header>
        <a-layout-content class="mangerCenterMain">
            <div v-if="isManageBox" class="manger-box">
                <div class="manger-operation-box">
                    <div class="view-description-box">{{viewDescription}}</div>
                    <a-row>
                        <a-button type="primary" shape="circle" @click="handleAddItem">
                          <template #icon><PlusOutlined /> </template>
                        </a-button>
                        <a-button v-if="!isMainList" type="primary" shape="circle" @click="handleShowInfo">
                          <template #icon><ExclamationOutlined /></template>
                        </a-button>
                        <a-button type="danger" shape="circle" @click="handleMulDelete">
                          <template #icon><DeleteOutlined /></template>
                        </a-button>
                        <a-button shape="circle" @click="handleShareBtn">
                          <template #icon><ShareAltOutlined /></template>
                        </a-button>
                    </a-row>
                </div>
                <div class="manger-content">
                    <ListView ref="listView"
                      :default-load="defaultLoad"
                      @view-read="readView"
                      @edit="handleEditItem"
                      @delete="handleDelete"
                      @on-change="handleViewChange"
                      @mul-section="handlemulSection"
                    ></ListView>
                </div>
            </div>
            <Element v-if="isElement"></Element>
        </a-layout-content>
        <SetProjectDialog v-model="showSetProjectDialog" :data="setProjectDialogData" @success="handleAddProjectSuccess"></SetProjectDialog>
        <SetModuleDialog v-model="showSetModuleDialog" :data="setModuleDialogData" @success="handleSetModuleSuccess"></SetModuleDialog>
        <ListInfoDialog v-if="!isMainList" v-model="showListInfoDialog"></ListInfoDialog>
        <!-- <DocEditDialog v-model:value="showDocEditDialog" :data="editData"></DocEditDialog> -->
        <ShareQRCodeDialog v-model="showShareTip" :url="currentUrl"></ShareQRCodeDialog>
    </a-layout>
</template>
<script>
import { useRoute } from 'vue-router'
import { mapActions, useStore } from 'vuex'
import { message, Modal, Row } from 'ant-design-vue'
import { PlusOutlined, ExclamationOutlined, DeleteOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import Utils from '@/lib/utils.js'
import PathBar from '@/components/bar/PathBar.vue'
import ListView from './components/view/ListView.vue'
import Element from './element/Element.vue'
// import DocEditDialog from './components/dialog/docEditDialog.vue'
import SetProjectDialog from './components/dialog/setProjectDialog.vue'
import SetModuleDialog from './components/dialog/setModuleDialog.vue'
import ListInfoDialog from './components/dialog/listInfoDialog.vue'
import ShareQRCodeDialog from './components/dialog/shareQRCodeDialog'
import { reactive, toRefs, computed, ref, onMounted } from 'vue'
export default {
  name: 'manage-center',
  setup () {
    console.log('data')
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      docId: '1519187825477',
      currentItem: {},
      listItems: [],
      activeNames: [],
      selectionList: [],
      viewType: 'listView',
      viewDescription: '',
      isManageBox: true,
      isDocView: false,
      isDocEdit: false,
      isElement: false,
      docData: {},
      viewData: {},
      // 设置项目弹窗显示数据
      setProjectDialogData: {
        type: 'add',
        name: '',
        description: ''
      },
      setModuleDialogData: {
        type: 'add',
        name: '',
        description: ''
      },
      showSetProjectDialog: false, // 设置项目弹窗显示隐藏
      showSetModuleDialog: false, // 设置
      showListInfoDialog: false, // 列表信息显示
      showDocEditDialog: false,
      showShareTip: false, // 分享tip显示隐藏
      editData: {
        id: '',
        title: '',
        path: '',
        tags: [],
        text: '123'
      },
      defaultLoad: false,
      currentUrl: window.location.href
    })
    const pathStr = computed(() => store.state.manageCenterStore.manageCenterPath)
    const pathId = computed(() => store.state.manageCenterStore.manageCenterPathId)
    const isMainList = computed(() => pathId.value === '')
    const pathBar = ref(null)
    const listView = ref(null)
    /**
     * 子组件查看回调函数
     * @param item
     */
    const readView = (item) => {
      if (item.type === '1') {
        state.isManageBox = false
        state.isDocView = false
        state.isElement = true
      }
    }
    /**
     * 面包屑跳转拦截
     * @param pathId {String} 路径id
     * @param pathName  {String} 路径文本
     */
    const beforePathChange = (pathId, pathName) => {
      let flag = false
      if (state.isElement) {
        flag = true
      } else if (state.isDocEdit) {
        Modal.confirm({
          title: '提示',
          content: '确定离开?',
          okText: '确定',
          cancelText: '取消',
          okType: 'warning',
          onOK: () => {
            //                flag = true;
            // 调用子组件的路径改变函数
            pathBar.value.changePathTo(pathId, pathName)
          }
        })
      } else {
        flag = true
      }
      return flag
    }
    /**
     * 面包屑跳转
     * @param name
     */
    const pathLinkTo = (name) => {
      if (state.isElement) {
        state.isElement = false
        state.isManageBox = true
      }
    }
    /**
     * 多选回调
     * @param {Array} selection 选择列表
     * @return {void}
     */
    const handlemulSection = (selection) => {
      state.selectionList = selection
    }
    /**
     * 视图改变事件
     * @param {Object} event
     * @return {void}
     */
    const handleViewChange = (event) => {
      state.viewDescription = event.viewDescription
    }
    /**
     * 添加按钮回调
     * @return {void}
     */
    const handleAddItem = () => {
      const setObj = {
        type: 'add',
        name: '',
        description: ''
      }
      if (this.isMainList) {
        state.setProjectDialogData = setObj
        state.showSetProjectDialog = true
      } else {
        state.setModuleDialogData = setObj
        state.showSetModuleDialog = true
      }
    }
    /**
     * 子组件编辑回调函数
     * @param {Object} item
     * @return {void}
     */
    const handleEditItem = (item) => {
      const setObj = {
        type: 'edit',
        id: item.id,
        name: item.name,
        description: item.description
      }
      if (state.isMainList) {
        state.setProjectDialogData = setObj
        state.showSetProjectDialog = true
      } else {
        setObj.typeId = item.typeId
        state.setModuleDialogData = setObj
        state.showSetModuleDialog = true
      }
    }
    /**
     * 子组件删除回调函数
     * @param {Object} item
     * @return {void}
     */
    const handleDelete = (item) => {
      Modal.confirm({
        title: '提示',
        content: '确定删除?',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const api = state.isMainList ? $api.manageCenter.deleteProject : $api.manageCenter.deleteModule
            await $axios.post(api, {
              id: [item.id]
            })
            message.success('删除成功')
            if (state.viewType === 'listView') {
              listView.value.updateView()
            }
          } catch (err) {
            message.error('删除失败')
          }
        }
      })
    }
    /**
     * 批量删除回调函数
     * @return {void}
     */
    const handleMulDelete = () => {
      if (state.selectionList.length === 0) {
        message.warning('请选择至少一条')
      } else {
        const list = state.selectionList.map(item => {
          return item.id
        })
        Modal.confirm({
          title: '提示',
          content: '确定删除?',
          okText: '确定',
          cancelText: '取消',
          onOK: async () => {
            try {
              const api = state.isMainList ? $api.manageCenter.deleteProject : $api.manageCenter.deleteModule
              await $axios.post(api, {
                id: list
              })
              message.success('删除成功')
              if (state.viewType === 'listView') {
                listView.value.updateView()
              }
            } catch (err) {
              message.error('删除失败')
            }
          }
        })
      }
    }
    /**
     * 添加项目成功回调
     * @return {void}
     */
    const handleAddProjectSuccess = () => {
      if (state.viewType === 'listView') {
        listView.value.updateView()
      }
    }
    /**
     * 设置项目成功回调
     * @return {void}
     */
    const handleSetModuleSuccess = () => {
      if (state.viewType === 'listView') {
        listView.value.updateView()
      }
    }
    /**
     * 查看列表信息
     * @return {Void}
     */
    const handleShowInfo = () => {
      state.showListInfoDialog = true
    }
    /**
     * 分享按钮回调
     * @return {void}
     */
    const handleShareBtn = () => {
      state.currentUrl = decodeURI(window.location.href)
      state.showShareTip = true
    }
    onMounted(() => {
      const query = route.query
      if (query.pathId && query.path) {
        store.dispatch('changeManageCenterPath', {
          pathId: Utils.pathStrDecode(query.pathId),
          type: query.path
        })
        const flag = (query.type !== 1)
        state.isElement = !flag
        state.isManageBox = flag
      } else {
        store.dispatch('changeManageCenterPath', {
          pathId: '',
          type: ''
        })
        state.defaultLoad = true
      }
    })
    return {
      pathBar,
      listView,
      ...toRefs(state),
      pathStr,
      pathId,
      isMainList,
      readView,
      beforePathChange,
      pathLinkTo,
      handlemulSection,
      handleViewChange,
      handleAddItem,
      handleEditItem,
      handleDelete,
      handleMulDelete,
      handleShowInfo,
      handleAddProjectSuccess,
      handleSetModuleSuccess,
      handleShareBtn
    }
  },
  components: {
    // 在#app元素内，注册组件
    PathBar,
    ListView,
    SetProjectDialog,
    SetModuleDialog,
    ListInfoDialog,
    // DocEditDialog,
    ShareQRCodeDialog,
    Element,
    PlusOutlined,
    ExclamationOutlined,
    DeleteOutlined,
    ShareAltOutlined,
    'a-row': Row
  },
  methods: {
    ...mapActions([
      'changeManageCenterPath'
    ])
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`;
    if (this.isDocEdit) {
      Modal.confirm('确定离开?', '提示', {
        okText: '确定',
        cancelText: '取消',
        type: 'warning'
      }).then(() => {
        // 选择确定
        next()
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
    .mangerCenter {
        border: none;
    }

    .manger-box {
        width: 100%;
        /*margin: 0 auto;*/
        /*padding: 20px;*/
        .path-bar {
            margin: 5px 0px;
        }
        .manger-operation-box{
          height: 40px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          background-color: #f0f2f5;
            .ant-row{
              .ant-btn {
                margin-right: 20px;
              }
            }
            .view-description-box{
                display: inline-block;
            }
        }
    }

    .mangerCenterHeader {
        line-height: 30px;
    }

    .mangerCenterMain {
        border: none;
        padding-top: 0px;
        padding-bottom: 0px;
        /*overflow-y: scroll;*/
    }

    .blur {
        -webkit-filter: blur(10px); /* Chrome, Opera */
        -moz-filter: blur(10px);
        -ms-filter: blur(10px);
        filter: blur(10px);
    }
</style>

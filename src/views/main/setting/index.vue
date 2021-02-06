<template>
  <a-layout class="setting">
    <a-layout-header class="settingHeader " style="height: 30px;background-color: #f0f2f5">
      设置菜单
    </a-layout-header>
    <a-layout>
      <a-layout-sider style="width: 200px;background-color: #f0f2f5">
        <a-menu
          mode="inline"
          class="a-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <a-sub-menu key="1">
            <template #title>
              <i class="iconfont icon-user "></i>
              <span class="memu-text">用户设置</span>
            </template>
            <a-menu-item-group key="1-">
              <a-menu-item key="1-1" @click="handleClick('1-1')">用户管理</a-menu-item>
              <a-menu-item key="1-2" @click="handleClick('1-2')">角色管理</a-menu-item>
              <a-menu-item key="1-3" @click="handleClick('1-3')">权限管理</a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
          <a-sub-menu key="2">
            <template #title>
              <i class="iconfont icon-control"></i>
              <span class="memu-text">系统设置</span>
            </template>
            <a-menu-item-group key="2-">
              <a-menu-item key="2-1" @click="handleClick('2-1')">通知管理</a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="settingMain">
        <component :is="settingCom"></component>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { defineAsyncComponent } from 'vue'
import { Menu } from 'ant-design-vue'
export default {
  name: 'manage-center',
  data () {
    return {
      docId: '1519187825477',
      currentItem: {},
      listItems: [],
      pathStr: '设置',
      activeNames: [],
      viewType: 'listView',
      viewDescription: '',
      isManageBox: true,
      isDocView: false,
      isDocEdit: false,
      docData: {},
      showSetProjectDialog: false,
      settingCom: 'userManage'
    }
  },
  methods: {
    handleClick (e) {
      let com = ''
      switch (e) {
        case '1-1': com = 'userManage'; break
        case '1-2': com = 'roleManage'; break
        case '1-3': com = 'rightManage'; break
      }
      this.settingCom = com
    }
  },
  components: {
    userManage: defineAsyncComponent(() => import('./userManage')),
    roleManage: defineAsyncComponent(() => import('./roleManage')),
    rightManage: defineAsyncComponent(() => import('./rightManage')),
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-sub-menu': Menu.SubMenu,
    'a-menu-item-group': Menu.ItemGroup
    // 在#app元素内，注册组件
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .setting {
    border: none;
    height: 100%;
  }

  .manger-box {
    width: 920px;
    margin: 0 auto;
    padding: 20px;
  }

  .settingHeader {
    line-height: 30px;
    margin-bottom: 20px;
  }

  .settingMain {
    border: none;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 20px;
    /*overflow-y: scroll;*/
  }

  .blur {
    -webkit-filter: blur(10px); /* Chrome, Opera */
    -moz-filter: blur(10px);
    -ms-filter: blur(10px);
    filter: blur(10px);
  }
  .memu-text {
    margin-left: 15px;
  }
</style>

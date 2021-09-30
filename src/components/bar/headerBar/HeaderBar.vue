<template>
  <div class="headerbar-box clearfix">
    <div class="logo-box">
      <img class="logo-pic" src="@/assets/img/DeepLink.png" alt="">
      <label>DeepLink</label>
      <div class="user-box">
        <a-dropdown class="user-dropdown" placement="bottomRight" @command="userDropDown">
          <span class="ant-dropdown-link user-pic">
            <img :src="userInfo.headSculpture" alt="">
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item></a-menu-item>
              <a-menu-item command="center">个人中心</a-menu-item>
              <a-menu-item command="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

    </div>
    <div class="tab-box">
      <div class="content">
        <ul class="tabs clearfix">
          <li class="tabs-panel" v-for="tab in tabList" :key="tab.path" @click="handleClick(tab)">
            <span class="panel-name">{{tab.name}}</span>
            <transition name="slide-fade">
              <span class="panel-underline" v-show="activeName==tab.path"></span>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message, Dropdown, Menu } from 'ant-design-vue'
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
export default {
  name: 'header-bar',
  setup () {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      tabActiveIndex: 0,
      msg: 'Welcome to Your Vue.js App'
    })
    const activeName = computed(() => store.state.headerBar.headerBarCurrentMenu)
    const userInfo = computed(() => store.state.platform.userInfo)
    const isAdmin = computed(() => store.getters.isAdmin)
    const tabList = computed(() => {
      const allList = [
        {
          name: '首页',
          path: '/index',
          index: 0,
          display: true
        },
        {
          name: '管理中心',
          path: '/manageCenter',
          index: 2,
          display: true
        },
        {
          name: '数据中心',
          path: '/dataCenter',
          index: 3,
          display: true
        }
      ]
      if (isAdmin.value) {
        allList.push({
          name: '设置',
          path: '/setting',
          index: 4,
          display: true
        })
      }
      return allList
    })
    const changeHeaderBarCurrentMenu = path => store.commit('changeHeaderBarCurrentMenu', path)
    const handleClick = (e) => {
      changeHeaderBarCurrentMenu(e.path)
      router.push({ path: e.path, params: '2018022001' })
    }
    /*
       * 退出登录
       */
    const logout = async () => {
      await store.dispatch('logout', (res) => {
        console.log('手动回登录页')
        if (!res.success) {
          message.error(res.message)
        } else {
          router.push({
            path: '/login'
          })
        }
      })
    }
    const userDropDown = (command) => {
      if (command === 'logout') {
        logout()
      }
    }
    onMounted(() => {
      const path = router.currentRoute.value.path
      const activeName = (path === '/') ? '/index' : path
      changeHeaderBarCurrentMenu(activeName)
    })
    watch(router.currentRoute, (newVal) => {
      const path = router.currentRoute.value.path
      const activeName = (path === '/') ? '/index' : path
      changeHeaderBarCurrentMenu(activeName)
    })
    return {
      ...toRefs(state),
      activeName,
      userInfo,
      isAdmin,
      tabList,
      changeHeaderBarCurrentMenu,
      handleClick,
      userDropDown,
      logout
    }
  },
  components: {
    'a-dropdown': Dropdown,
    'a-menu': Menu,
    'a-menu-item': Menu.Item
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .headerbar-box {
    width: 100%;
    height: 118px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
    background-color: #ffffff;
    cursor: pointer;
    text-align: center;
    .logo-box {
      display: inline-block;
      width: 1024px;
      font-size: 24px;
      font-weight: bold;
      line-height: 59px;
      margin-right: auto;
      .logo-pic {
        display: inline-block;
        float: left;
        height: 59px;
        margin-left: 15px;
        margin-right: 20px;
      }
      .user-box {
        display: flex;
        justify-content: flex-end;
        height: 40px;
        width: 120px;
        /*float: right;*/
        margin-top: 10px;
        margin-left: auto;
        .user-dropdown{
          height: 40px;
          &.user-pic {
            display: flex;
            height: 40px;
            width: 40px;
            border-radius: 20px;
            border: 1px solid #ccc;
            overflow: hidden;
            line-height: 40px;
            justify-content: center;
            align-items: center;
            img {
              display: inline-block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
      label {
        float: left;
      }
    }
  ;
    .tab-box {
      display: flex;
      justify-content: center;
      height: 59px;
      background-color: #5d9aff;
      .content {
        height: 100%;
        width: 1024px;
        .tabs {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          margin-top: 10px;
          .tabs-panel {
            height: 33px;
            line-height: 40px;
            margin: 0px 20px;
            position: relative;
            .panel-name {
              display: block;
              width: 100%;
              height: 30px;
              font-size: 16px;
              line-height: 30px;
              margin-top: 7px;
              color: #ffffff;
            }
            .panel-underline {
              display: block;
              width: 100%;
              height: 3px;
              background-color: #ffffff;
              position: absolute;
              top: 38px;
            }
          }
        }
      }
    }
  }
</style>

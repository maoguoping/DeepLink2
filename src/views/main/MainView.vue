<template>
  <div class="main">
    <header-bar class="header"></header-bar>
    <div class="wrapper">
      <div class="wrapper-main">
      <a-layout>
        <a-layout>
          <a-layout-content>
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
      </div>
    </div>
  </div>
</template>

<script>
// 使用ES6特性引入 localstorage 储存脚本，命名为 Storage

// ES6语法，相当于
// new Vue({})
import { useStore } from 'vuex'
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import HeaderBar from '@/components/bar/headerBar/HeaderBar.vue'
export default {
  name: 'mainView',
  setup () {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const state = reactive({
      mainPath: 'index',
      path: window.location.pathname
    })
    const loginStatus = () => {
      store.dispatch('setUserInfo')
    }
    const getPageAcceessList = () => {
      store.dispatch('getPageAcceessList')
    }
    onMounted(() => {
      console.log(proxy.$eventbus)
      proxy.$eventbus.$on('docChangeTo', function (e) {
        state.mainPath = '1000'
      })
      proxy.$eventbus.$on('gotoIndex', function (e) {
        state.mainPath = 'index'
      })
    })
    return {
      ...toRefs(state),
      loginStatus,
      getPageAcceessList
    }
  },
  components: {
    // // 在#app元素内，注册组件
    'header-bar': HeaderBar
  }
}
</script>
<style lang="scss" scoped>
  /*width: 100%;*/
  /*height: 100%;*/
  /*display: inline-block;*/
  .header{
    position: fixed;
    z-index: 10;
  }
  //总布局
  .wrapper {
    width: 100%;
    position: relative;
    padding-top: 118px;
    background: #f0f2f5;
    min-height: 100vh;
    //中心布局
    .wrapper-main {
      width: 1024px;
      height: 100%;
      margin: 0 auto;
      & > .a-layout {
        box-sizing: border-box;
        height: 100%;
        border-right:1px solid #eee;
        border-left:1px solid #eee;
        .a-layout-content {
          background: #fff;
          box-shadow: 0 1px 3px rgba(26,26,26,.1);
        }
        /*border: 1px solid #eee;*/
        aside {
          width: 300px;
          height: 100%;
          background-color: #ffffff;
        }
        section {
          & > .a-layout-content{
            /*overflow: visible;*/
          }
        }
      }
    }
  }
</style>

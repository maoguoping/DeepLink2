<template>
    <div class="manger-box">
        <path-bar pathData="pathStr"></path-bar>
        <div class="manger-content">

        </div>
    </div>
</template>
<script>
import PathBar from '../bar/PathBar.vue'
import { reactive, toRefs } from 'vue'
export default {
  name: 'manger-center',
  setup () {
    const state = reactive({
      msg: 'Welcome to Your Vue.js App',
      listName: '大渣好，我系...',
      pathStr: ''
    })
    return {
      ...toRefs(state)
    }
  },
  components: {
    // 在#app元素内，注册组件
    'path-bar': PathBar
  }
}
</script>

<style lang="scss" scoped type="text/scss">
    .manger-box {
        width: 920px;
        margin: 0 auto;
        padding: 20px;
    }
</style>

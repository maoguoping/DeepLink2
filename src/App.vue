<template>
  <a-config-provider :locale="locale">
    <div id="DeepLink">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { reactive, toRefs } from 'vue'
export default {
  name: 'app', // name属性作为组件名称，全局 ID 自动作为组件的 name
  setup () {
    const state = reactive({
      locale: zhCN
    })
    return {
      ...toRefs(state)
    }
  },
  components: {
    'a-config-provider': ConfigProvider
  }
}
</script>
<style lang="scss" type="text/scss">
    @import "assets/css/base.scss";

    html {
        /*overflow: hidden;*/
        height: 100%;
    }

    .app {
        background-color: #999;
        height: 100%;
    }

</style>

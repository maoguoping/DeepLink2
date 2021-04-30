<template>
  <a-modal
    title="二维码分享"
    v-model:visible="dialogVisible"
    width="230px"
    okText="确定"
    cancelText="关闭"
    @ok="handleClose"
    @cancel="handleClose"
    class="shareQRCodeDialog"
  >
    <div class="svg-box" style="">
      <div class="svg-pic" v-html="svg"></div>
    </div>
  </a-modal>
</template>
<script>
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { watch, toRefs, reactive } from 'vue'
export default {
  name: 'shareQRCodeDialog',
  props: {
    // 显示隐藏
    modelValue: {
      type: Boolean,
      required: true
    },
    url: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup (props, { emit }) {
    const { modelValue } = toRefs(props)
    const state = reactive({
      dialogVisible: false,
      svg: ''
    })
    const handleClose = () => {
      emit('update:modelValue', false)
    }
    watch(modelValue, (newVal) => {
      $axios.post($api.api.getQrCodeImageFromUrl, {
        query: window.location.href
      }).then(res => {
        state.svg = res.data
      })
      state.dialogVisible = newVal
    })
    return {
      ...toRefs(state),
      handleClose
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .svg-box {
    display: flex;
    justify-content: center;
    height: 125px;
    width: 100%;
    text-align: center;
    .svg-pic {
      width: 100px;
      height: 100px;
    }
  }
</style>

<template>
  <a-modal
    title="二维码分享"
    v-model:visible="dialogVisible"
    width="230px"
    okText="确定"
    cancelText="关闭"
    @ok="handleClose"
    @close="handleClose"
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
export default {
  name: 'shareQRCodeDialog',
  props: {
    // 显示隐藏
    value: {
      type: Boolean,
      required: true
    },
    url: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      svg: ''
    }
  },
  computed: {

  },
  methods: {
    handleClose () {
      this.$emit('update:value', false)
    }
  },
  watch: {
    value (newVal) {
      $axios.post($api.api.getQrCodeImageFromUrl, {
        query: window.location.href
      }).then(res => {
        this.svg = res.data
      })
      this.dialogVisible = newVal
    },
    url (newVal) {
      console.log(newVal)
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

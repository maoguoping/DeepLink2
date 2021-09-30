<template>
    <div class="edit-text">
      <span v-if="status==0" class="text-view">
        {{textVal}}
        <i class="iconfont icon-edit-square" @click="editFun"></i>
      </span>
      <span v-if="status==1" class="input-view" >
        <input ref="inputBox" class="input-box" type="text" v-model="textVal" @blur="textFun">
      </span>
    </div>
</template>

<script>
import { reactive, toRefs, watch, ref, nextTick } from 'vue'
export default {
  name: 'EditText',
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup (props, { emit }) {
    const { value } = toRefs(props)
    const state = reactive({
      status: 0,
      textVal: value.value
    })
    const inputBox = ref(null)
    const textFun = () => {
      state.status = 0
    }
    const editFun = () => {
      state.status = 1
      nextTick(() => {
        inputBox.value.focus()
      })
    }
    watch(value, newVal => {
      state.textVal = newVal
    })
    watch(state.textVal, newVal => {
      emit('update:value', newVal)
    })
    return {
      ...toRefs(state),
      inputBox,
      editFun,
      textFun
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-text{
  .text-view{
    .iconfont{
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .input-view{
    .input-box{
      box-sizing: border-box;
      display: inline;
      width: 100%;
      padding: 0 5px;
    }
  }
}
</style>

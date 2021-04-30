<template>
    <div class="listInfoDialog">
        <a-modal
          title="列表信息"
          v-model:visible="dialogVisible"
          width="30%"
          okText="确定"
          cancelText="关闭"
          @ok="handleClose"
          @cancel="handleClose">
          <div>
             <ul>
               <li>
                 <label>名称：</label><span>{{listInfo.name}}</span>
               </li>
               <li>
                 <label>类型：</label><span>{{listInfo.type}}</span>
               </li>
               <li>
                 <label>描述：</label><span>{{listInfo.description}}</span>
               </li>
             </ul>
          </div>
        </a-modal>
    </div>
</template>
<script>
import { useStore } from 'vuex'
import { watch, toRefs, computed, reactive } from 'vue'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup (props, { emit }) {
    const { modelValue } = toRefs(props)
    const state = reactive({
      dialogVisible: false
    })
    const store = useStore()
    const manageCenterInfo = computed(() => store.state.manageCenterStore.manageCenterInfo)
    const listInfo = computed(() => {
      return manageCenterInfo.value || {
        name: '',
        description: '',
        id: '',
        type: '',
        typeId: '',
        tag: '',
        path: '',
        pathId: '',
        parentId: '',
        parentName: '',
        parentType: '',
        parentTypeId: '',
        parentPath: '',
        parentPathId: '',
        modifyDate: '',
        children: []
      }
    })
    watch(modelValue, (newVal) => {
      state.dialogVisible = newVal
    })
    const handleClose = () => {
      emit('update:modelValue', false)
    }
    return {
      ...toRefs(state),
      listInfo,
      handleClose
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
</style>

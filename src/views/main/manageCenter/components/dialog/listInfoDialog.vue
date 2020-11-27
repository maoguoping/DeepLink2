<template>
    <div class="listInfoDialog">
        <a-modal
          title="列表信息"
          v-model:visible="dialogVisible"
          width="30%"
          okText="确定"
          cancelText="关闭"
          @ok="handleClose"
          @close="handleClose">
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
import { mapState } from 'vuex'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      manageCenterInfo: state => state.manageCenterStore.manageCenterInfo
    }),
    listInfo () {
      return this.manageCenterInfo || {
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
    }
  },
  methods: {
    handleClose (done) {
      this.$emit('update:value', false)
    }
  },
  watch: {
    value (newVal) {
      this.dialogVisible = newVal
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
</style>

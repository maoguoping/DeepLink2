<template>
    <div class="addProjectDialog">
        <a-modal
          :title="data.type=='add'?'新建项目':'编辑项目'"
          v-model:visible="dialogVisible"
          width="30%"
          @cancel="handleClose">
          <a-form :model="setProjectForm" :rules="rules" ref="setProjectForm">
            <a-form-item label="项目名称" name="name">
              <a-input  auto-complete="off" :maxlength="20" v-model:value="setProjectForm.name"></a-input>
            </a-form-item>
            <a-form-item label="项目介绍" name="description">
              <a-textarea
                type="textarea"
                :autoSize="false"
                placeholder="请输入内容"
                v-model:value="setProjectForm.description"
                :maxlength="200"
              >
              </a-textarea>
            </a-form-item>
          </a-form>
          <template #footer>
            <span class="dialog-footer">
              <a-button @click="handleClose">取 消</a-button>
              <a-button type="primary" @click="handleSubmit">确 定</a-button>
            </span>
          </template>
        </a-modal>
    </div>
</template>
<script>
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { message } from 'ant-design-vue'
import { watch, ref, toRefs, reactive } from 'vue'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    modelValue: {
      type: Boolean,
      required: true,
      default: () => false
    },
    // 类型与数据
    data: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    console.debug('setup', props)
    const { modelValue, data } = toRefs(props)
    const rules = {
      name: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
      ],
      description: [
        { required: false },
        { min: 0, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
      ]
    }
    const dialogVisible = ref(false)
    const setProjectForm = reactive({
      id: '',
      name: '',
      oldName: '',
      description: ''
    })
    watch(data, (newVal) => {
      setProjectForm.id = newVal.id
      setProjectForm.name = newVal.name
      setProjectForm.oldName = newVal.name
      setProjectForm.description = newVal.description || ''
    })
    watch(modelValue, (newVal) => {
      dialogVisible.value = newVal
    })
    return {
      dialogVisible,
      setProjectForm,
      rules
    }
  },
  methods: {
    handleClose (done) {
      this.$refs.setProjectForm.resetFields()
      this.$emit('update:modelValue', false)
    },
    handleSubmit () {
      if (this.data.type === 'add') {
        this.$refs.setProjectForm.validate().then((valid) => {
          if (valid) {
            const info = this.setProjectForm
            $axios.post($api.manageCenter.addProject, {
              info: JSON.stringify(info)
            }).then(res => {
              message.success('提交成功')
              this.$emit('close')
              this.$emit('success')
            })
          }
        })
      } else if (this.data.type === 'edit') {
        this.$refs.setProjectForm.validate().then((valid) => {
          if (valid) {
            const info = this.setProjectForm
            $axios.post($api.manageCenter.updateProject, {
              info: JSON.stringify(info)
            }).then(res => {
              message.success('修改成功')
              this.$emit('close')
              this.$emit('success')
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
</style>

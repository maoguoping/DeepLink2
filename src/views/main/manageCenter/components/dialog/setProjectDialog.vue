<template>
    <div class="addProjectDialog">
        <a-modal
          :title="data.type=='add'?'新建项目':'编辑项目'"
          v-model:visible="dialogVisible"
          width="30%"
          @cancel="handleClose">
          <a-form :model="setProjectFormData" :rules="rules" ref="form">
            <a-form-item label="项目名称" name="name">
              <a-input  auto-complete="off" :maxlength="20" v-model:value="setProjectFormData.name"  :defaultValue="setProjectFormData.name"></a-input>
            </a-form-item>
            <a-form-item label="项目介绍" name="description">
              <a-textarea
                type="textarea"
                :autoSize="false"
                placeholder="请输入内容"
                :defaultValue="setProjectFormData.description"
                v-model:value="setProjectFormData.description"
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
    const setProjectFormData = reactive({
      id: '',
      name: '',
      oldName: '',
      description: ''
    })
    watch(data, (newVal) => {
      setProjectFormData.id = newVal.id
      setProjectFormData.name = newVal.name
      setProjectFormData.oldName = newVal.name
      setProjectFormData.description = newVal.description || ''
    })
    watch(modelValue, (newVal) => {
      dialogVisible.value = newVal
    })
    return {
      dialogVisible,
      setProjectFormData,
      rules
    }
  },
  methods: {
    handleClose (done) {
      this.$refs.form.resetFields()
      this.$emit('update:modelValue', false)
    },
    handleSubmit () {
      if (this.data.type === 'add') {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            const info = this.setProjectFormData
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
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            const info = this.setProjectFormData
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

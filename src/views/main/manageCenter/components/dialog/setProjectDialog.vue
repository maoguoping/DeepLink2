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
  setup (props, { emit }) {
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
    const form = ref(null)
    const setProjectFormData = reactive({
      id: '',
      name: '',
      oldName: '',
      description: ''
    })
    const handleClose = () => {
      form.value.resetFields()
      emit('update:modelValue', false)
    }
    const handleSubmit = () => {
      let api, text
      if (data.value.type === 'add') {
        api = $api.manageCenter.addProject
        text = '提交成功'
      } else {
        api = $api.manageCenter.updateProject
        text = '修改成功'
      }
      form.value.validate().then((valid) => {
        if (valid) {
          $axios.post(api, {
            info: JSON.stringify(setProjectFormData)
          }).then(res => {
            message.success(text)
            emit('success')
            handleClose()
          })
        }
      })
    }
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
      rules,
      form,
      handleClose,
      handleSubmit
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
</style>

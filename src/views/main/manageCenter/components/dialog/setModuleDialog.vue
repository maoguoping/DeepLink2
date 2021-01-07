<template>
  <div class="setModuleDialog">
    <a-modal
      :title="data.type=='add'?'新建模块':'编辑模块'"
      v-model:visible="dialogVisible"
      width="30%"
      @cancel="handleClose">
      <a-form :model="setModuleFormData" :rules="rules" ref="form">
        <a-form-item label="模块类型" name="moduleType" v-show="data.type == 'add'">
          <br>
          <a-radio-group v-model:value="setModuleFormData.moduleType">
            <a-radio value="0">文件夹</a-radio>
            <a-radio value="1">元素</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="模块名称" name="name">
          <a-input auto-complete="off" :maxlength="20" v-model:value="setModuleFormData.name"></a-input>
        </a-form-item>
        <a-form-item label="文件夹类型" name="typeId" v-if="setModuleFormData.moduleType == '0'">
          <br>
          <a-select v-model:value="setModuleFormData.typeId">
            <a-select-option
              v-for="item in folderTypeList"
              :key="item.id"
              :title="item.name"
              :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="元素类型" name="typeId" v-if="setModuleFormData.moduleType === '1'">
          <br>
          <a-select v-model:value="setModuleFormData.typeId">
            <a-select-option
              v-for="item in elementTypeList"
              :key="item.id"
              :title="item.name"
              :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模块介绍" name="description">
          <a-textarea
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model:value="setModuleFormData.description"
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
import { mapState } from 'vuex'
import { message } from 'ant-design-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { watch, ref, toRefs, reactive, readonly } from 'vue'
import { useElementTypeDic, useFolderTypeDic } from '../../hooks'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    modelValue: {
      type: Boolean,
      required: true,
      default: false
    },
    // 类型与数据
    data: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { modelValue, data } = toRefs(props)
    const rules = readonly({
      name: [
        { required: true, message: '请输入模块名称', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
      ],
      description: [
        { required: false },
        { min: 0, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
      ],
      typeId: [
        { required: true, message: '必须选择分类', trigger: 'blur' }
      ]
    })
    const dialogVisible = ref(false)
    const setModuleFormData = reactive({
      id: '', // 模块id
      name: '', // 模块名称
      oldName: '', // 模块原名称
      typeId: '', // 模块类型id
      moduleType: '0', // 模块类型(0：文件夹；1：元素)
      description: '' // 模块描述
    })
    const { folderTypeList, getFolderTypeDic } = useFolderTypeDic()
    const { elementTypeList, getElementTypeDic } = useElementTypeDic()
    watch(modelValue, async (newVal) => {
      if (newVal) {
        await getFolderTypeDic()
        await getElementTypeDic()
      }
      dialogVisible.value = newVal
    })
    watch(data, (newVal) => {
      const { id, name, description, typeId, moduleType } = newVal
      setModuleFormData.id = id
      setModuleFormData.name = name
      setModuleFormData.oldName = name
      setModuleFormData.description = description
      setModuleFormData.typeId = typeId
      setModuleFormData.moduleType = moduleType || '0'
    })
    return {
      dialogVisible,
      folderTypeList,
      elementTypeList,
      setModuleFormData,
      rules
    }
  },
  computed: {
    ...mapState({
      listInfo: state => state.manageCenterStore.manageCenterInfo
    })
  },
  methods: {
    /**
       * 弹窗关闭回调
       * @param {function} done
       * @return {void}
       */
    handleClose (done) {
      this.$refs.form.resetFields()
      this.$emit('update:modelValue', false)
    },
    /**
       * 提交表单
       * @return {void} 回调函数
       */
    handleSubmit () {
      if (this.data.type === 'add') {
        const params = {
          parentId: this.listInfo.id,
          parentName: this.listInfo.name,
          parentPath: this.listInfo.path,
          parentPathId: this.listInfo.pathId,
          parentType: this.listInfo.type,
          parentTypeId: this.listInfo.typeId
        }
        Object.assign(params, this.setModuleFormData)
        this.$refs.form.validate((valid) => {
          if (valid) {
            $axios.post($api.manageCenter.addModule, {
              info: JSON.stringify(params)
            }).then(res => {
              message.success('提交成功')
              this.$emit('close')
              this.$emit('success')
            })
          }
        })
      } else if (this.data.type === 'edit') {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const params = {
              parentId: this.listInfo.id,
              parentName: this.listInfo.name,
              parentPath: this.listInfo.path,
              parentPathId: this.listInfo.pathId,
              parentType: this.listInfo.type,
              parentTypeId: this.listInfo.typeId
            }
            Object.assign(params, this.setModuleFormData)
            $axios.post($api.manageCenter.updateModule, {
              info: JSON.stringify(params)
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

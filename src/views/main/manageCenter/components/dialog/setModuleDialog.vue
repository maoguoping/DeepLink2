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
import { useStore } from 'vuex'
import { message, Radio } from 'ant-design-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { watch, ref, toRefs, reactive, readonly, computed } from 'vue'
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
  setup (props, { emit }) {
    const { modelValue, data } = toRefs(props)
    const store = useStore()
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
        { required: true, message: '必须选择分类', trigger: 'blur', type: 'number' }
      ]
    })
    const form = ref(null)
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
    const listInfo = computed(() => store.state.manageCenterStore.manageCenterInfo)
    const handleClose = () => {
      form.value.resetFields()
      emit('update:modelValue', false)
    }
    const handleSubmit = () => {
      let api, text
      if (data.value.type === 'add') {
        api = $api.manageCenter.addModule
        text = '提交成功'
      } else {
        api = $api.manageCenter.updateModule
        text = '修改成功'
      }
      const params = {
        parentId: listInfo.value.id,
        parentName: listInfo.value.name,
        parentPath: listInfo.value.path,
        parentPathId: listInfo.value.pathId,
        parentType: listInfo.value.type,
        parentTypeId: listInfo.value.typeId
      }
      Object.assign(params, setModuleFormData)
      form.value.validate().then((valid) => {
        if (valid) {
          $axios.post(api, {
            info: JSON.stringify(params)
          }).then(res => {
            message.success(text)
            handleClose()
            emit('success')
          })
        }
      })
    }
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
      rules,
      form,
      handleClose,
      handleSubmit
    }
  },
  components: {
    'a-radio': Radio,
    'a-radio-group': Radio.Group
  }
}
</script>

<style lang="scss" scoped type="text/scss">
</style>

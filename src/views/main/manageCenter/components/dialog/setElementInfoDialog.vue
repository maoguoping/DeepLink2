<template>
  <div class="setElementInfoDialog">
    <a-modal
      title="编辑信息"
      v-model:visible="dialogVisible"
      width="30%"
      @cancel="handleClose">
      <a-form :model="setElementInfoFormData" :rules="rules" ref="form">
        <a-form-item label="模块介绍" name="elementDescription">
          <br>
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false"
                  @close="handleCloseTag(tag)">
            {{tag}}
          </el-tag>
          <a-input class="input-new-tag" v-if="inputVisible" v-model:value="inputValue" ref="saveTagInput" size="small"
                    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"></a-input>
          <a-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</a-button>
        </a-form-item>
        <a-form-item label="模块介绍" name="elementDescription">
          <a-textarea
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model:value="setElementInfoFormData.elementDescription"
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
import { watch, ref, toRefs } from 'vue'
import { useElementTypeDic, useFolderTypeDic } from '../../hooks'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    value: {
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
  data () {
    return {
      setElementInfoFormData: {
        elementId: '', // 模块id
        elementName: '', // 模块名称
        elementDescription: '' // 模块描述
      },
      rules: {
        elementDescription: [
          { required: false },
          { min: 0, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        moduleTypeId: [
          { required: true, message: '必须选择分类', trigger: 'blur' }
        ]
      },
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  setup (props) {
    const { value } = toRefs(props)
    const dialogVisible = ref(false)
    const { folderTypeList, getFolderTypeDic } = useFolderTypeDic()
    const { elementTypeList, getElementTypeDic } = useElementTypeDic()
    watch(value, async (newVal) => {
      if (newVal) {
        await getFolderTypeDic()
        await getElementTypeDic()
      }
      dialogVisible.value = newVal
    })
    return {
      dialogVisible,
      folderTypeList,
      elementTypeList
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
      this.$emit('update:value', false)
    },
    handleCloseTag (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
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
        Object.assign(params, this.setElementInfoFormData)
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
            Object.assign(params, this.setElementInfoFormData)
            $axios.post($api.manageCenter.updateModule, params).then(res => {
              message.success('修改成功')
              this.$emit('close')
              this.$emit('success')
            })
          }
        })
      }
    }
  },
  watch: {
    data (newVal) {
      this.setElementInfoFormData = {
        elementId: newVal.id,
        elementName: newVal.name,
        oldelementName: newVal.name,
        elementDescription: newVal.description,
        moduleTypeId: newVal.typeId,
        moduleType: newVal.moduleType || '0'
      }
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .description-text {
    width: 100%;
    font-size: 12px;
    text-indent: 2em;
  }
</style>

<template>
  <div class="roleEditDialog">
    <a-modal
      :title="type=='add'?'新增角色':'编辑角色'"
      v-model:visible="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @cancel="handleClose">
      <div>
        <a-form :inline="true" label-width="80px" :model="roleInfo">
          <a-form-item label="角色名:" name="roleName">
            <a-input v-model:value="roleInfo.roleName" style="width: 150px"></a-input>
          </a-form-item>
          <a-form-item label="角色id:" name="roleId">
            <a-input v-model:value="roleInfo.roleId" style="width: 150px" :disabled="type == 'edit'"></a-input>
          </a-form-item>
          <a-form-item label="角色描述:" name="description">
            <a-input v-model:value="roleInfo.description" type="textarea" style="width: 400px"></a-input>
          </a-form-item>
        </a-form>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <a-button @click="handleClose">取 消</a-button>
          <a-button type="primary" @click="saveFun">保 存</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>
<script>
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { message } from 'ant-design-vue'
import { watch, toRefs, reactive } from 'vue'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    modelValue: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true,
      default: () => 'add'
    },
    data: {
      type: Object,
      required: true,
      default: () => {
        return {
          roleName: '',
          roleId: '',
          description: ''
        }
      }
    }
  },
  setup (props, { emit }) {
    const { modelValue, type, data } = toRefs(props)
    const state = reactive({
      dialogVisible: false,
      roleInfo: {
        roleId: '',
        roleName: '',
        description: ''
      }
    })
    const handleClose = () => {
      emit('update:modelValue', false)
    }
    const addRole = async () => {
      try {
        await $axios.post($api.setting.addRole, {
          ...state.roleInfo
        })
        emit('update', type.value)
      } catch (err) {
        message.error('新增角色失败！')
      }
    }
    const updateRole = async () => {
      try {
        await $axios.post($api.setting.updateRole, {
          ...state.roleInfo
        })
        emit('update', type.value)
      } catch (err) {
        message.error('修改角色失败！')
      }
    }
    const saveFun = () => {
      const { roleName, roleId } = state.roleInfo
      if (roleName === '') {
        message.warning('角色名不能为空！')
      } else if (roleId === '') {
        message.warning('角色id不能为空！')
      } else {
        $axios.post($api.setting.checkRoleExist, {
          roleName,
          roleId,
          type: type.value
        }).then(res => {
          if (res.data.list.length > 0 && this.type === 'add') {
            message.warning('角色以及角色id不可重复！')
          } else {
            if (type.value === 'add') {
              addRole()
            } else {
              updateRole()
            }
          }
        }).catch(e => {
          console.log(e)
        })
      }
    }
    watch(modelValue, (newVal) => {
      if (type.value === 'add') {
        state.roleInfo = {
          roleId: '',
          roleName: '',
          description: ''
        }
      }
      state.dialogVisible = newVal
    })
    watch(data, (newVal) => {
      console.log(newVal)
      const { roleId, roleName, description } = newVal
      state.roleInfo = {
        roleId,
        roleName,
        description
      }
    })
    return {
      ...toRefs(state),
      handleClose,
      saveFun
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .roleEditDialog {
    .info-title {
      font-size: 16px;
      font-weight: bold;
    }
    .content-box {
      padding: 20px;
      display: flex;
      justify-content: flex-start;
      .pic-box {
        display: inline-block;
        width: 60px;
        height: 60px;
        background-color: #3a8ee6;
      }
      .info-box {
        display: inline-block;
        width: 385px;
        padding: 0 20px;
        ul {
          li {
            height: 30px;
            line-height: 30px;
            display: flex;
            justify-content: flex-start;
            label {
              font-weight: bold;
            }
          ;
            .name-block {
              display: inline-block;
              width: 190px;
              .name-block-content {
                display: inline-block;
                width: 120px;
              }
            }
          }
        }
      }
      .info-label {
        font-size: 14px;
        font-weight: bold;
      }
      .info-detail {
        margin-left: 15px;
      }
    }
  }
</style>

<template>
  <div class="rightEditDialog">
    <a-modal
      :title="type=='add'?'新增权限':'编辑权限'"
      v-model:visible="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @cancel="handleClose">
      <div>
        <a-form :inline="true" label-width="80px" :model="rightInfo">
          <a-form-item label="权限名:" name="rightName">
            <a-input v-model:value="rightInfo.rightName" style="width: 150px"></a-input>
          </a-form-item>
          <a-form-item label="权限id:" name="rightId">
            <a-input v-model:value="rightInfo.rightId" style="width: 220px" disabled></a-input>
          </a-form-item>
          <a-form-item label="权限路径:" name="path">
            <a-input v-model:value="rightInfo.path" style="width: 220px"></a-input>
          </a-form-item>
          <a-form-item label="权限描述:" name="description">
            <a-input v-model:value="rightInfo.description" type="textarea" style="width: 400px"></a-input>
          </a-form-item>
          <a-form-item label="角色设置:" class="transfer-item" name="roleIds">
            <a-transfer
              :titles="transferTitle"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入角色名"
              @change="handleRoleChange"
              :target-keys="ownRoleList"
              :data-source="roleList">
                <template #render="item">
                  <span class="custom-item">
                    {{ item.name }}
                  </span>
                </template>
            </a-transfer>
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
import { message, Transfer } from 'ant-design-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { watch, ref, toRefs, reactive, readonly, toRaw } from 'vue'
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
          rightName: '',
          rightId: '',
          description: '',
          path: ''
        }
      }
    }
  },
  setup (props, { emit }) {
    const { modelValue, data, type } = toRefs(props)
    const dialogVisible = ref(false)
    const transferTitle = readonly([
      '无权限角色',
      '有权限角色'
    ])
    const roleList = ref([])
    const ownRoleList = ref([])
    const rightInfo = reactive({
      rightId: '',
      rightName: '',
      description: '',
      roleIds: [],
      path: ''
    })
    const getRoleListDic = async () => {
      const res = await $axios.get($api.api.getRoleListDic, {})
      roleList.value = res.data.map(item => {
        return {
          ...item,
          key: item.id + '',
          title: item.name
          // chosen: false
        }
      })
      console.log('roleList.value', roleList.value)
    }
    const getRoleByRight = async () => {
      try {
        const res = await $axios.post($api.setting.getRoleByRight, {
          rightId: rightInfo.rightId
        })
        let roleIds = []
        if (res.list.length > 0) {
          roleIds = res.list.map(i => i.roleId)
        }
        ownRoleList.value = res.list.map(i => i.roleId + '')
        rightInfo.roleIds = roleIds
      } catch (err) {
        message.error('加载拥有权限的角色失败')
      }
    }
    const handleRoleChange = (targetKeys, direction, moveKeys) => {
      console.log(targetKeys, direction, moveKeys)
      ownRoleList.value = targetKeys.map(i => i + '')
    }
    const getArrDifference = (arr1, arr2) => {
      let arr1Change = []
      let arr2Change = []
      arr1Change = arr1.filter(item => {
        return !arr2.includes(item)
      })
      arr2Change = arr2.filter(item => {
        return !arr1.includes(item)
      })
      return {
        preview: arr1Change,
        after: arr2Change
      }
    }
    const updateRight = async () => {
      const { preview, after } = getArrDifference(rightInfo.roleIds, ownRoleList.value)
      const { rightId } = rightInfo
      try {
        await $axios.post($api.setting.changeRoleRight, {
          rightId: rightId,
          addRoleIds: after.join(','),
          deleteRoleIds: preview.join(',')
        })
        emit('update', type.value)
      } catch (err) {
        message.error('修改权限角色失败')
      }
    }
    const addRight = async () => {
      try {
        await $axios.post($api.setting.addRight, {
          ...rightInfo,
          addRoleIds: ownRoleList.value.join(',')
        })
        emit('update', type.value)
      } catch (err) {
        message.error('新增权限角色失败')
      }
    }
    const saveFun = async () => {
      const { rightName, rightId } = toRaw(rightInfo)
      if (rightName === '') {
        message.warning('权限名不能为空！')
      } else {
        try {
          const res = await $axios.post($api.setting.checkRightExist, {
            rightName,
            rightId,
            type: type.value
          })
          if (res.list.length > 0 && type.value === 'add') {
            message.warning('权限以及权限id不可重复！')
          } else {
            console.log(type.value)
            if (type.value === 'add') {
              addRight()
            } else {
              updateRight()
            }
          }
        } catch (err) {
          message.error(' 保存窗口数据失败！')
        }
      }
    }
    const handleClose = () => {
      emit('update:modelValue', false)
    }
    watch(modelValue, async (newVal) => {
      console.log('roleList.value', roleList.value)
      if (newVal) {
        await getRoleListDic()
        console.log('roleList.value', roleList.value)
        if (type.value === 'add') {
          rightInfo.rightId = ''
          rightInfo.rightName = ''
          rightInfo.description = ''
          dialogVisible.value = true
        } else {
          const { rightId, rightName, description, path } = data.value
          rightInfo.rightId = rightId
          rightInfo.rightName = rightName
          rightInfo.description = description
          rightInfo.path = path
          getRoleByRight()
        }
        dialogVisible.value = true
      } else {
        dialogVisible.value = false
      }
    })
    const filterMethod = (query, item) => {
      return item.name.indexOf(query) > -1
    }
    return {
      dialogVisible,
      transferTitle,
      rightInfo,
      roleList,
      ownRoleList,
      filterMethod,
      handleRoleChange,
      handleClose,
      saveFun
    }
  },
  components: {
    'a-transfer': Transfer
  }
}
</script>
<style lang="scss" type="text/scss">
.rightEditDialog {
  .transfer-item {
    .a-form-item__content {
      padding-left: 14px !important;
    }
  }
}
</style>
<style lang="scss" scoped type="text/scss">
  .rightEditDialog {
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

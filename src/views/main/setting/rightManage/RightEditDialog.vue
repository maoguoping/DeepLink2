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
import { message } from 'ant-design-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    value: {
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
  data () {
    return {
      dialogVisible: false,
      transferTitle: [
        '无权限角色',
        '有权限角色'
      ],
      rightInfo: {
        rightId: '',
        rightName: '',
        description: '',
        roleIds: [],
        path: ''
      },
      roleList: [],
      ownRoleList: [],
      filterMethod (query, item) {
        return item.name.indexOf(query) > -1
      }
    }
  },
  computed: {},
  methods: {
    handleRoleChange (targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)
      this.ownRoleList = targetKeys
    },
    /**
     * 关闭窗口回调
     * @return {Void}
     */
    handleClose () {
      this.$emit('update:value', false)
    },
    /**
     * 保存窗口数据
     * @param {function} 回调函数
     * @return {Void}
     */
    async saveFun () {
      const { rightName, rightId } = this.rightInfo
      if (rightName === '') {
        message.warning('权限名不能为空！')
      } else {
        try {
          const res = await $axios.post($api.setting.checkRightExist, {
            rightInfo: JSON.stringify({ rightName, rightId }),
            type: this.type
          })
          if (res.list.length > 0 && this.type === 'add') {
            message.warning('权限以及权限id不可重复！')
          } else {
            console.log(this.type)
            if (this.type === 'add') {
              this.addRight()
            } else {
              this.updateRight()
            }
          }
        } catch (err) {
          message.error(' 保存窗口数据失败！')
        }
      }
    },
    /**
     * 新增权限
     * @return {Void}
     */
    async addRight () {
      try {
        await $axios.post($api.setting.addRight, {
          rightInfo: JSON.stringify(this.rightInfo),
          addRoleIds: this.ownRoleList.join(',')
        })
        this.$emit('update', this.type)
      } catch (err) {
        message.error('新增权限角色失败')
      }
    },
    /**
     * 修改权限
     * @return {Void}
     */
    async updateRight () {
      const { preview, after } = this.getArrDifference(this.rightInfo.roleIds, this.ownRoleList)
      const { rightId } = this.rightInfo
      try {
        await $axios.post($api.setting.changeRoleRight, {
          rightId: rightId,
          addRoleIds: after.join(','),
          deleteRoleIds: preview.join(',')
        })
        this.$emit('update', this.type)
      } catch (err) {
        message.error('修改权限角色失败')
      }
    },
    /**
     * 用户名更改回调
     * @param {String} username 用户名
     * @return {Void}
     */
    changeUsername (username) {
      this.userInfo.username = username
    },
    /**
     * 用户昵称更改回调
     * @param {String} userTickName 用户名
     * @return {Void}
     */
    changeUserTickName (userTickName) {
      this.userInfo.userTickName = userTickName
    },
    /**
     * 用户权限更改回调
     * @param {String} rightId 用户权限id
     * @return {Void}
     */
    changeRole (rightId) {
      this.userInfo.rightId = rightId
    },
    /**
     * 加载权限下拉列表
     * @return {void}
     */
    async getRoleListDic () {
      const res = await $axios.get($api.api.getRoleListDic, {})
      this.roleList = res.data.map(item => {
        return {
          ...item,
          key: item.id
          // chosen: false
        }
      })
      console.log(this.roleList)
    },
    /**
     * 获取拥有权限的角色
     * @return {void}
     */
    async getRoleByRight () {
      setTimeout(() => {
        this.dialogVisible = true
      }, 300)
      try {
        const res = await $axios.post($api.setting.getRoleByRight, {
          rightId: this.rightInfo.rightId
        })
        let roleIds = []
        if (res.list.length > 0) {
          roleIds = res.list.map(i => i.roleId)
        }
        this.ownRoleList = roleIds
        this.rightInfo.roleIds = roleIds
      } catch (err) {
        message.error('加载拥有权限的角色失败')
      }
    },
    getArrDifference (arr1, arr2) {
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
  },
  async mounted () {
    // await this.getRoleListDic()
  },
  watch: {
    async value (newVal) {
      if (newVal) {
        await this.getRoleListDic()
        if (this.type === 'add') {
          this.rightInfo = {
            rightId: '',
            rightName: '',
            description: ''
          }
          this.dialogVisible = true
        } else {
          const { rightId, rightName, description, path } = this.data
          this.rightInfo = {
            rightId, rightName, description, path
          }
          this.getRoleByRight()
        }
      } else {
        this.dialogVisible = false
      }
    }
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

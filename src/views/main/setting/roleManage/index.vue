<template>
  <div class="roleManage">
    <a-breadcrumb separator-class="a-icon-arrow-right">
      <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.value">{{item.label}}</a-breadcrumb-item>
    </a-breadcrumb>
    <SearchBox>
      <template v-slot:main>
        <a-form ref="registerForm" :model="form" layout="inline" @submit.prevent>
          <a-form-item label="角色名" name="username" class="search-box-item">
            <a-input v-model:value="form.roleName" style="width: 210px"></a-input>
          </a-form-item>
          <a-form-item label="角色id" name="userTickName" class="search-box-item">
            <a-input v-model:value="form.roleId" style="width: 210px"></a-input>
          </a-form-item>
          <a-form-item label="创建日期" name="createTime" class="search-box-item">
            <a-range-picker
              v-model:value="form.createTime"
              format="yyyy/MM/dd"
              style="width: 240px"
            >
            </a-range-picker>
          </a-form-item>
          <a-form-item label prop class="search-box-item search-btn">
            <a-button type="ghost" @click="resetFun" style="width: 80px;padding: 10px">重置条件</a-button>
            <a-button type="primary" @click="searchFun" style="width: 185px">搜索</a-button>
          </a-form-item>
        </a-form>
      </template>
    </SearchBox>
    <div class="btn-box">
       <a-button type="primary" @click="handleAddRole">
        <template #icon><PlusOutlined /></template>新增
      </a-button>
    </div>
    <a-table
      ref="multipleTable"
      :data-source="roleList"
      :columns="columns"
      :pagination="false"
      style="width: 100%"
      class="multipleTable"
      childrenColumnName="childrenRow"
      @sort-change="handleSortChange"
      rowKey="roleId"
    >
      <template type="selection" width="55"></template>
      <template name="roleName" width="120"></template>
      <template name="roleId"  sortable="custom" width="90"></template>
      <template name="createTime"  width="170" sortable="custom"></template>
      <template name="description" ></template>
      <template name="action" fixed="right" width="90" #action="{ record }">
        <a-button size="small" type="primary" @click="handleEdit(record)">编辑</a-button>
      </template>
    </a-table>
    <div class="pagination-box" v-if="roleList.length>0">
      <a-pagination
        @showSizeChange="handleSizeChange"
        @change="handleCurrentChange"
        :v-model:current="page.currentPage"
        v-model:pageSize="page.pageSize"
        showQuickJumper
        showSizeChanger
        background
        :total="page.total"
      ></a-pagination>
    </div>
    <RoleEditDialog
      v-model="showRoleEditDialog"
      :type="roleEditDialogType"
      :data="editRoleInfo"
      @update="editConfirm"
    ></RoleEditDialog>
  </div>
</template>

<script>
import Utils from '@/lib/utils.js'
import { message, Table, Pagination, Breadcrumb, DatePicker } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import SearchBox from '@/components/modules/SearchBox'
import RoleEditDialog from './RoleEditDialog'
export default {
  name: 'roleManage',
  data () {
    const page = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [10, 20, 30, 40]
    }
    return {
      page,
      roleList: [], // 角色列表
      breadcrumbList: [
        {
          label: '用户设置',
          value: '1'
        },
        {
          label: '角色管理',
          value: '11'
        }
      ],
      form: {
        roleName: '',
        roleId: '',
        createTime: []
      },
      roleEditDialogType: 'add',
      editRoleInfo: {},
      showRoleEditDialog: false, // 显示编辑角色弹框
      sortCol: 'roleId',
      sortOrder: 'ASC',
      columns: [
        {
          title: '角色名',
          dataIndex: 'roleName',
          key: 'roleName',
          fixed: 'left'
        },
        {
          title: '角色id',
          dataIndex: 'roleId',
          key: 'roleId',
          fixed: 'left'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '角色描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          slots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    /**
     * 加载列表数据
     * @return {void}
     */
    async load () {
      const { roleName, roleId, createTime } = this.form
      const { currentPage, pageSize } = this.page
      const createTimeList = []
      if (createTime && createTime.length === 2) {
        createTime.map(item => {
          const date = new Date(item)
          if (date !== new Date(null)) {
            createTimeList.push(Utils.timeFormat(date, 'yyyy-MM-dd hh:mm:ss'))
          }
        })
      }
      try {
        const res = await $axios.post($api.setting.getRoleList, {
          searchData: JSON.stringify({
            roleId,
            roleName,
            createTime: createTimeList.join(','),
            orderName: this.sortCol,
            orderType: this.sortOrder,
            index: currentPage,
            pageSize
          })
        })
        const result = res.data.list.map(item => {
          item.createTime = Utils.timeFormat(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss') || ''
          return item
        })
        this.roleList = result
        this.page.total = res.data.total
      } catch (err) {
        message.error('加载列表数据失败！')
      }
    },
    /**
     * 搜索按钮回调
     * @return {void}
     */
    searchFun () {
      this.page.currentPage = 1
      this.load()
    },
    resetFun () {
      this.form = {
        username: '',
        userId: '',
        userTickName: '',
        roleId: '',
        createTime: [],
        lastLoginTime: []
      }
    },
    /**
     * 分页页面size变化回调
     * @param {Number} val 更改数字
     * @return {void}
     */
    handleSizeChange (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.searchFun()
    },
    /**
     * 分页页码变化回调
     * @param {Number} val 更改数字
     * @return {void}
     */
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.load()
    },
    /**
     * 分页页码变化回调
     * @param {Object} row 行数据
     * @return {void}
     */
    handleEdit (row) {
      this.roleEditDialogType = 'edit'
      this.editRoleInfo = row
      console.log(row)
      this.showRoleEditDialog = true
    },
    /**
     * 修改用户信息成功回调
     * @return {void}
     */
    handleEditUpdate () {
      this.showUserEditDialog = false
      this.load()
    },
    /**
     * 排序更改回调
     * @param params {Object} 参数
     * @return {void}
     */
    handleSortChange (params) {
      const { prop, order } = params
      let sortOrder = ''
      order === 'ascending' ? (sortOrder = 'ASC') : (sortOrder = 'DESC')
      this.sortCol = prop
      this.sortOrder = sortOrder
      this.load()
    },
    /**
     * 新增角色弹窗回调
     * @return {void}
     */
    handleAddRole () {
      this.roleEditDialogType = 'add'
      this.showRoleEditDialog = true
    },
    /**
     * 弹窗确定回调
     * @param {string} type 成功关闭类别
     * @return {void}
     */
    editConfirm (type) {
      this.showRoleEditDialog = false
      if (type === 'add') {
        message.success('新增角色成功')
      } else {
        message.success('修改角色成功')
      }
      this.searchFun()
    }
  },
  mounted () {
    this.load()
  },
  components: {
    SearchBox,
    RoleEditDialog,
    PlusOutlined,
    'a-table': Table,
    'a-pagination': Pagination,
    'a-breadcrumb': Breadcrumb,
    'a-breadcrumb-item': Breadcrumb.Item,
    'a-range-picker': DatePicker.RangePicker
  }
}
</script>

<style lang="scss" scoped>
.roleManage {
  height: 100%;
  .search-box {
    .search-btn {
      padding-left: 30px;
    }
  }
  .btn-box {
    margin-bottom: 15px;
  }
  .pagination-box {
    display: block;
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<template>
  <div class="userManage">
    <a-breadcrumb separator-class="a-icon-arrow-right">
      <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.value">
        {{item.label}}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <SearchBox>
      <template v-slot:main>
        <a-form ref="registerForm" :model="form" layout="inline"
          @submit.prevent>
          <a-form-item label="用户名" name="username" class="search-box-item">
            <a-input v-model:value="form.username" style="width: 210px"></a-input>
          </a-form-item>
          <a-form-item label="用户昵称" name="userTickName" class="search-box-item">
            <a-input v-model:value="form.userTickName" style="width: 210px"></a-input>
          </a-form-item>
          <br class="search-box-item">
          <a-form-item label="用户角色" name="roleId" class="search-box-item">
            <a-select v-model:value="form.roleId" mode="multiple" placeholder="请选择" style="width: 210px">
              <a-select-option
                v-for="item in roleList"
                :key="item.id"
                :title="item.name"
                :value="item.id"
                style="width: 210px"
              >
              {{item.name}}
              </a-select-option>
            </a-select>
            <!--<a-input v-model:value="form.roleId" style="width: 210px"></a-input>-->
          </a-form-item>
          <a-form-item label="用户id" name="userId" class="search-box-item">
            <a-input v-model:value="form.userId" style="width: 210px"></a-input>
          </a-form-item>
          <br class="search-box-item">
          <a-form-item label="创建日期" name="createTime" class="search-box-item">
            <a-range-picker
              v-model:value="form.createTime"
              format="yyyy/MM/dd"
              style="width: 240px"
            >
            </a-range-picker>
          </a-form-item>
          <a-form-item label="最后登录日期" name="lastLoginTime" class="search-box-item">
            <a-range-picker
              v-model:value="form.lastLoginTime"
              format="yyyy/MM/dd"
              style="width: 240px"
            >
            </a-range-picker>
          </a-form-item>
          <a-form-item label="" name="" class="search-box-item search-btn">
            <a-button type="ghost" @click="resetFun" style="width: 80px;padding: 10px">重置条件</a-button>
            <a-button type="primary" @click="searchFun" style="width: 185px">搜索</a-button>
          </a-form-item>
        </a-form>
      </template>
    </SearchBox>
    <a-table
      ref="multipleTable"
      :data-source="userListData"
      :columns="columns"
      :pagination="false"
      class="multipleTable"
      childrenColumnName="childrenRow"
      @sort-change="handleSortChange"
      :scroll="{ x: 1000 }"
      rowKey="userId"
    >
      <template
        type="selection"
        width="55">
      </template>
      <template
        name="username"
        sortable
        width="120">
      </template>
      <template
        name="userId"
        sortable="custom"
        width="120">
      </template>
      <template
        name="userTickName"
        width="100">
      </template>
      <template
        name="createTime"
        width="170"
        sortable="custom">
      </template>
      <template
        name="lastLoginTime"
        width="170"
        sortable="custom">
      </template>
      <template
        name="roleName"
      >
      </template>
      <template
        name="action"
        fixed="right"
        #action="{ record }"
      >
         <a-button
            size="small"
            type="primary"
            @click="handleEdit(record)">编辑
          </a-button>
      </template>
    </a-table>
    <div class="pagination-box" v-if="userListData.length>0">
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
    <UserEditDialog v-model="showUserEditDialog" :data="editUserInfo" :type="userEditDialogType"
     @update="handleEditUpdate"></UserEditDialog>
  </div>
</template>

<script>
import Utils from '@/lib/utils.js'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import SearchBox from '@/components/modules/SearchBox'
import UserEditDialog from './UserEditDialog'
import { message, Table, Pagination, Breadcrumb, DatePicker } from 'ant-design-vue'
import { useRoleListDic } from '../hooks'
export default {
  name: 'userManage',
  setup () {
    console.log('setup')
    const { roleList } = useRoleListDic()
    return {
      roleList
    }
  },
  data () {
    const page = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [10, 20, 30, 40]
    }
    return {
      page,
      // roleList: [], // 角色列表
      breadcrumbList: [
        {
          label: '用户设置',
          value: '1'
        },
        {
          label: '用户管理',
          value: '11'
        }
      ],
      userListData: [],
      form: {
        username: '',
        userId: '',
        userTickName: '',
        roleId: [],
        createTime: [],
        lastLoginTime: []
      },
      userEditDialogType: 'edit',
      editUserInfo: {},
      showUserEditDialog: false, // 显示编辑用户弹框，
      sortCol: 'username',
      sortOrder: 'ASC',
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 4
      },
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
          fixed: 'left'
        },
        {
          title: '用户id',
          dataIndex: 'userId',
          key: 'userId',
          fixed: 'left'
        },
        {
          title: '用户昵称',
          dataIndex: 'userTickName',
          key: 'userTickName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '最后登录时间',
          dataIndex: 'lastLoginTime',
          key: 'lastLoginTime'
        },
        {
          title: '最后登录时间',
          dataIndex: 'lastLoginTime',
          key: 'lastLoginTime'
        },
        {
          title: '角色',
          key: 'roleName',
          dataIndex: 'roleName'
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
      console.log('load')
      const { username, userId, userTickName, roleId, createTime, lastLoginTime } = this.form
      const { currentPage, pageSize } = this.page
      const createTimeList = []

      const loginTimeList = []
      if (createTime && createTime.length === 2) {
        createTime.map(item => {
          const date = new Date(item)
          if (date !== new Date(null)) {
            createTimeList.push(Utils.timeFormat(date, 'yyyy-MM-dd hh:mm:ss'))
          }
        })
      }
      if (lastLoginTime && lastLoginTime.length === 2) {
        lastLoginTime.map(item => {
          const date = new Date(item)
          if (date !== new Date(null)) {
            loginTimeList.push(Utils.timeFormat(date, 'yyyy-MM-dd hh:mm:ss'))
          }
        })
      }
      try {
        const res = await $axios.post($api.setting.getUserList, {
          searchData: JSON.stringify({
            username,
            userId,
            userTickName,
            roleId: roleId ? roleId.join(',') : '',
            createTime: createTimeList ? createTimeList.join(',') : '',
            lastLoginTime: loginTimeList ? loginTimeList.join(',') : '',
            orderName: this.sortCol,
            orderType: this.sortOrder,
            index: currentPage,
            pageSize
          })
        })
        const result = res.data.userList.map(item => {
          item.createTime = Utils.timeFormat(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss')
          item.lastLoginTime = Utils.timeFormat(new Date(item.lastLoginTime), 'yyyy-MM-dd hh:mm:ss')
          return item
        })
        console.log(result)
        this.userListData = result
        this.page.total = res.data.total
      } catch (err) {
        message.error('加载用户列表失败')
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
      this.editUserInfo = row
      console.log(row)
      this.showUserEditDialog = true
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
      order === 'ascending' ? sortOrder = 'ASC' : sortOrder = 'DESC'
      this.sortCol = prop
      this.sortOrder = sortOrder
      this.load()
    }
  },
  mounted () {
    console.log('option mount')
    this.load()
  },
  components: {
    SearchBox,
    UserEditDialog,
    'a-table': Table,
    'a-pagination': Pagination,
    'a-breadcrumb': Breadcrumb,
    'a-breadcrumb-item': Breadcrumb.Item,
    'a-range-picker': DatePicker.RangePicker
  }
}
</script>

<style lang="scss" scoped>
  .userManage {
    height: 100%;
    .search-box {
      .search-btn {
        padding-left: 30px;
      }
    }
    .pagination-box {
      display: block;
      text-align: center;
      margin-top: 20px;
    }
  }
</style>

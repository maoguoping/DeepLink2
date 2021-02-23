<template>
  <div class="userManage">
    <a-breadcrumb separator-class="a-icon-arrow-right">
      <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.value">
        {{item.label}}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <SearchBox>
      <template v-slot:main>
        <a-form ref="registerForm" :model="form" layout="inline" :label-col="{style: 'width: 100px' }" :wrapper-col="{style: 'width: 265px' }"  labelAlign="right"
          @submit.prevent>
          <a-form-item label="用户名" name="username" class="search-box-item" >
            <a-input v-model:value="form.username" style="width: 80%"></a-input>
          </a-form-item>
          <a-form-item label="用户昵称" name="userTickName" class="search-box-item">
            <a-input v-model:value="form.userTickName" style="width: 80%"></a-input>
          </a-form-item>
          <br class="search-box-item">
          <a-form-item label="用户角色" name="roleId" class="search-box-item">
            <a-select v-model:value="form.roleId" mode="multiple" placeholder="请选择" style="width: 80%">
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
            <a-input v-model:value="form.userId" style="width: 80%"></a-input>
          </a-form-item>
          <br class="search-box-item">
          <a-form-item label="创建日期" name="createTime" class="search-box-item">
            <a-range-picker
              v-model:value="form.createTime"
              format="yyyy/MM/dd"
              style="width: 80%"
            >
            </a-range-picker>
          </a-form-item>
          <a-form-item label="最后登录日期" name="lastLoginTime" class="search-box-item">
            <a-range-picker
              v-model:value="form.lastLoginTime"
              format="yyyy/MM/dd"
              style="width: 80%"
            >
            </a-range-picker>
          </a-form-item>
          <div class="search-btn-box search-box-item">
            <a-button class="search" type="primary" @click="searchFun" >搜索</a-button>
            <a-button class="reset" type="default" @click="resetFun" >重置条件</a-button>
          </div>
        </a-form>
      </template>
    </SearchBox>
    <a-table
      ref="multipleTable"
      rowKey="userId"
      :data-source="userListData"
      :columns="columns"
      :pagination="false"
      :scroll="{ x: 1000 }"
      :loading="loading"
      class="multipleTable"
      childrenColumnName="childrenRow"
      @sort-change="handleSortChange"
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
import { ref, reactive, onMounted, toRaw } from 'vue'
import { message, Table, Pagination, Breadcrumb, DatePicker } from 'ant-design-vue'
import { useRoleListDic, usePage, useTableSort } from '../hooks'
export default {
  name: 'userManage',
  setup () {
    console.log('setup')
    const { roleList } = useRoleListDic()
    const { page, handleSizeChange, handleCurrentChange } = usePage(load)
    const breadcrumbList = [
      {
        label: '用户设置',
        value: '1'
      },
      {
        label: '用户管理',
        value: '11'
      }
    ]
    const columns = [
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
    const userListData = ref([])
    const editUserInfo = ref({})
    const userEditDialogType = ref('edit')
    const showUserEditDialog = ref(false)
    /**
     * 修改用户信息成功回调
     */
    const handleEdit = (row) => {
      userEditDialogType.value = 'edit'
      editUserInfo.value = row
      console.log(row)
      showUserEditDialog.value = true
    }
    /**
     * 修改用户信息成功回调
     */
    const handleEditUpdate = () => {
      showUserEditDialog.value = false
      load()
    }
    const form = reactive({
      username: '',
      userId: '',
      userTickName: '',
      roleId: [],
      createTime: [],
      lastLoginTime: []
    })
    /**
     * 搜索清空
     */
    const resetFun = () => {
      form.username = ''
      form.userId = ''
      form.userTickName = ''
      form.roleId = ''
      form.createTime = []
      form.lastLoginTime = []
    }
    const labelCol = reactive({
      span: 2
    })
    const wrapperCol = reactive({
      span: 5
    })
    console.debug(page.pageSize)
    const loading = ref(false)
    /**
     * 加载函数
     */
    async function load () {
      const { username, userId, userTickName, roleId, createTime, lastLoginTime } = form
      const { currentPage, pageSize } = toRaw(page)
      console.log('load', currentPage, pageSize)
      const createTimeList = []
      const loginTimeList = []
      if (createTime && createTime.length === 2) {
        createTime.forEach(item => {
          const date = new Date(item)
          if (date !== new Date(null)) {
            createTimeList.push(Utils.timeFormat(date, 'yyyy-MM-dd hh:mm:ss'))
          }
        })
      }
      if (lastLoginTime && lastLoginTime.length === 2) {
        lastLoginTime.forEach(item => {
          const date = new Date(item)
          if (date !== new Date(null)) {
            loginTimeList.push(Utils.timeFormat(date, 'yyyy-MM-dd hh:mm:ss'))
          }
        })
      }
      try {
        loading.value = true
        console.debug('roleId', roleId)
        const res = await $axios.post($api.setting.getUserList, {
          username,
          userId,
          userTickName,
          roleId: roleId ? roleId.join(',') : '',
          createTime: createTimeList ? createTimeList.join(',') : '',
          lastLoginTime: loginTimeList ? loginTimeList.join(',') : '',
          orderName: sortCol.value,
          orderType: sortOrder.value,
          index: currentPage,
          pageSize: pageSize
        })
        console.debug('res', res)
        const result = res.data.userList.map(item => {
          item.createTime = Utils.timeFormat(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss')
          item.lastLoginTime = Utils.timeFormat(new Date(item.lastLoginTime), 'yyyy-MM-dd hh:mm:ss')
          return item
        })
        userListData.value = result
        page.total = res.data.total
        loading.value = false
      } catch (err) {
        console.error(err)
        loading.value = false
        message.error('加载用户列表失败')
      }
    }
    /**
     * 搜索按钮回调
     */
    const searchFun = async () => {
      page.currentPage = 1
      load()
    }
    const {
      sortCol,
      sortOrder,
      handleSortChange
    } = useTableSort('username', 'ASC', load)
    onMounted(() => { load() })
    return {
      roleList,
      page,
      handleSizeChange,
      handleCurrentChange,
      breadcrumbList,
      columns,
      userListData,
      editUserInfo,
      userEditDialogType,
      form,
      showUserEditDialog,
      sortCol,
      sortOrder,
      handleSortChange,
      labelCol,
      wrapperCol,
      loading,
      load,
      searchFun,
      resetFun,
      handleEdit,
      handleEditUpdate
    }
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
      .search-btn-box {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        .search {
          width: 185px;
          margin-right: 20px;
        }
        .reset {
          width: 80px;
        }
      }
      .search-box-item {
        width: 365px;
      }
    }
    .pagination-box {
      display: block;
      text-align: center;
      padding: 20px 0;
    }
  }
</style>

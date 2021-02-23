<template>
  <div class="roleManage">
    <a-breadcrumb separator-class="a-icon-arrow-right">
      <a-breadcrumb-item
        :key="item.value"
        v-for="item in breadcrumbList"
      >{{item.label}}</a-breadcrumb-item>
    </a-breadcrumb>
    <SearchBox>
      <template v-slot:main>
        <a-form
          :model="form"
          @submit.prevent
          layout="inline"
          ref="registerForm"
          :label-col="{style: 'width: 100px' }" :wrapper-col="{style: 'width: 265px' }"  labelAlign="right"
        >
          <a-form-item
            class="search-box-item"
            label="角色名"
            name="username"
          >
            <a-input
              style="width: 80%"
              v-model:value="form.roleName"
            ></a-input>
          </a-form-item>
          <a-form-item
            class="search-box-item"
            label="角色id"
            name="userTickName"
          >
            <a-input
              style="width: 80%"
              v-model:value="form.roleId"
            ></a-input>
          </a-form-item>
          <a-form-item
            class="search-box-item"
            label="创建日期"
            name="createTime"
          >
            <a-range-picker
              format="yyyy/MM/dd"
              style="width: 80%"
              v-model:value="form.createTime"
            ></a-range-picker>
          </a-form-item>
          <div
            class="search-btn-box search-box-item"
          >
            <a-button class="search" type="primary" @click="searchFun" >搜索</a-button>
            <a-button class="reset" type="default" @click="resetFun" >重置条件</a-button>
          </div>
        </a-form>
      </template>
    </SearchBox>
    <div class="btn-box">
      <a-button
        @click="handleAddRole"
        type="primary"
        shape="round"
      >
        <template #icon>
          <PlusOutlined />
        </template>新增
      </a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="roleList"
      :pagination="false"
      :loading="loading"
      @sort-change="handleSortChange"
      childrenColumnName="childrenRow"
      class="multipleTable"
      ref="multipleTable"
      rowKey="roleId"
      style="width: 100%"
    >
      <template
        type="selection"
        width="55"
      ></template>
      <template
        name="roleName"
        width="120"
      ></template>
      <template
        name="roleId"
        sortable="custom"
        width="90"
      ></template>
      <template
        name="createTime"
        sortable="custom"
        width="170"
      ></template>
      <template name="description"></template>
      <template
        #action="{ record }"
        fixed="right"
        name="action"
        width="90"
      >
        <a-button
          @click="handleEdit(record)"
          size="small"
          type="primary"
        >编辑</a-button>
      </template>
    </a-table>
    <div
      class="pagination-box"
      v-if="roleList.length>0"
    >
      <a-pagination
        :total="page.total"
        :v-model:current="page.currentPage"
        @change="handleCurrentChange"
        @showSizeChange="handleSizeChange"
        background
        showQuickJumper
        showSizeChanger
        v-model:pageSize="page.pageSize"
      ></a-pagination>
    </div>
    <RoleEditDialog
      :data="editRoleInfo"
      :type="roleEditDialogType"
      @update="editConfirm"
      v-model="showRoleEditDialog"
    ></RoleEditDialog>
  </div>
</template>

<script>
import Utils from '@/lib/utils.js'
import {
  message,
  Table,
  Pagination,
  Breadcrumb,
  DatePicker
} from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import SearchBox from '@/components/modules/SearchBox'
import RoleEditDialog from './RoleEditDialog'
import { ref, reactive, onMounted, toRaw } from 'vue'
import { usePage, useTableSort } from '../hooks'
export default {
  name: 'roleManage',
  setup () {
    const breadcrumbList = [
      {
        label: '用户设置',
        value: '1'
      },
      {
        label: '角色管理',
        value: '11'
      }
    ]
    const columns = [
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
    const { page, handleSizeChange, handleCurrentChange } = usePage(load)
    const roleList = ref([])
    const form = reactive({
      roleName: '',
      roleId: '',
      createTime: []
    })
    /**
     * 搜索按钮回调
     */
    const searchFun = () => {
      page.currentPage = 1
      load()
    }
    /**
     * 重置条件
     */
    const resetFun = () => {
      form.username = ''
      form.userId = ''
      form.userTickName = ''
      form.roleId = ''
      form.createTime = []
      form.lastLoginTime = []
    }
    const roleEditDialogType = ref('add')
    const editRoleInfo = ref({})
    const showRoleEditDialog = ref(false)
    /**
     * 修改用户信息
     */
    const handleEdit = (row) => {
      roleEditDialogType.value = 'edit'
      editRoleInfo.value = row
      console.log(row)
      showRoleEditDialog.value = true
    }
    /**
     * 修改用户信息成功回调
     */
    const handleEditUpdate = () => {
      showRoleEditDialog.value = false
      load()
    }
    /**
     * 新增角色弹窗回调
     */
    const handleAddRole = () => {
      roleEditDialogType.value = 'add'
      showRoleEditDialog.value = true
    }
    /**
     * 弹窗确定回调
     */
    const editConfirm = (type) => {
      showRoleEditDialog.value = false
      if (type === 'add') {
        message.success('新增角色成功')
      } else {
        message.success('修改角色成功')
      }
      searchFun()
    }
    const loading = ref(false)
    /**
     * 加载数据函数
     */
    async function load () {
      const { roleName, roleId, createTime } = form
      const { currentPage, pageSize } = toRaw(page)
      const createTimeList = []
      if (createTime && createTime.length === 2) {
        createTime.forEach(item => {
          const date = new Date(item)
          if (date !== new Date(null)) {
            createTimeList.push(Utils.timeFormat(date, 'yyyy-MM-dd hh:mm:ss'))
          }
        })
      }
      try {
        loading.value = true
        const res = await $axios.post($api.setting.getRoleList, {
          roleId,
          roleName,
          createTime: createTimeList.join(','),
          orderName: sortCol.value,
          orderType: sortOrder.value,
          index: currentPage,
          pageSize
        })
        const result = res.data.list.map(item => {
          item.createTime =
            Utils.timeFormat(
              new Date(item.createTime),
              'yyyy-MM-dd hh:mm:ss'
            ) || ''
          return item
        })
        roleList.value = result
        page.total = res.data.total
        loading.value = false
      } catch (err) {
        loading.value = false
        message.error('加载列表数据失败！')
      }
    }
    const { sortCol, sortOrder, handleSortChange } = useTableSort(
      'roleId',
      'ASC',
      load
    )
    onMounted(() => {
      load()
    })
    return {
      breadcrumbList,
      page,
      handleSizeChange,
      handleCurrentChange,
      roleList,
      form,
      roleEditDialogType,
      editRoleInfo,
      showRoleEditDialog,
      columns,
      load,
      sortCol,
      sortOrder,
      loading,
      handleSortChange,
      searchFun,
      resetFun,
      handleEdit,
      handleEditUpdate,
      handleAddRole,
      editConfirm
    }
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
  .btn-box {
    margin-bottom: 15px;
  }
  .pagination-box {
    display: block;
    text-align: center;
    padding: 20px 0;
  }
}
</style>

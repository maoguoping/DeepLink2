<template>
  <div class="rightManage">
    <a-breadcrumb separator-class="a-icon-arrow-right">
      <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.value">{{item.label}}</a-breadcrumb-item>
    </a-breadcrumb>
    <SearchBox>
      <template v-slot:main>
        <a-form ref="registerForm" :model="form" layout="inline" @submit.prevent>
          <a-form-item label="权限名" name="rightName" class="search-box-item">
            <a-input v-model:value="form.rightName" style="width: 210px"></a-input>
          </a-form-item>
          <a-form-item label="权限id" name="rightId" class="search-box-item">
            <a-input v-model:value="form.rightId" style="width: 210px"></a-input>
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
      <a-button type="primary" @click="handleAddRight">
        <template #icon><PlusOutlined /></template>新增
      </a-button>
      <a-button type="danger" @click="handleDelRight">
        <template #icon><DeleteOutlined /></template>删除
      </a-button>
    </div>
    <a-table
      ref="multipleTable"
      :data-source="rightList"
      :columns="columns"
      :pagination="false"
      style="width: 100%"
      class="multipleTable"
      :row-selection="rowSelection"
      childrenColumnName="childrenRow"
      @sort-change="handleSortChange"
      :scroll="{ x: 1200 }"
      rowKey="rightId"
    >
      <!-- <template type="selection" width="55"></template> -->
      <template name="rightName"  sortable width="120"></template>
      <template name="rightId"  sortable="custom" width="90"></template>
      <template name="path"  width="170"></template>
      <template name="createTime"  width="170"></template>
      <template name="description" ></template>
      <template name="action" fixed="right" width="90" #action="{ record }">
        <a-button size="small" type="primary" @click="handleEdit(record)">编辑</a-button>
      </template>
    </a-table>
    <div class="pagination-box" v-if="rightList.length>0">
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
    <RightEditDialog
      v-model="showRightEditDialog"
      :type="rightEditDialogType"
      :data="editRightInfo"
      @update="editConfirm"
    ></RightEditDialog>
  </div>
</template>

<script>
import { message, Table, Pagination, Breadcrumb, DatePicker } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import Utils from '@/lib/utils.js'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import SearchBox from '@/components/modules/SearchBox'
import RightEditDialog from './RightEditDialog'
export default {
  name: 'rightManage',
  data () {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.handleSelectionChange(selectedRows)
      }
    }
    const page = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [10, 20, 30, 40]
    }
    return {
      rowSelection,
      page,
      rightList: [], // 角色列表
      breadcrumbList: [
        {
          label: '用户设置',
          value: '1'
        },
        {
          label: '权限管理',
          value: '12'
        }
      ],
      form: {
        rightName: '',
        rightId: '',
        createTime: []
      },
      rightEditDialogType: 'add',
      editRightInfo: {},
      showRightEditDialog: false, // 显示编辑角色弹框
      sortCol: 'rightId',
      sortOrder: 'ASC',
      selectList: [],
      columns: [
        {
          title: '权限名称',
          dataIndex: 'rightName',
          key: 'rightName',
          fixed: 'left'
        },
        {
          title: '权限id',
          dataIndex: 'rightId',
          key: 'rightId',
          fixed: 'left'
        },
        {
          title: '权限路径',
          dataIndex: 'path',
          key: 'path'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '权限描述',
          key: 'description',
          dataIndex: 'description'
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
      const { rightName, rightId, createTime } = this.form
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
      console.log('请求接口')
      try {
        const res = await $axios.post($api.setting.getRightList, {
          searchData: JSON.stringify({
            rightId: rightId,
            rightName: rightName,
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
        this.rightList = result
        this.page.total = res.data.total
        this.selectList = []
      } catch (err) {
        message.error(' 加载列表数据失败！')
      }
    },
    /**
     * 搜索按钮回调
     * @return {void}
     */
    searchFun () {
      console.log(this.form)
      this.page.currentPage = 1
      this.load()
    },
    resetFun () {
      this.form = {
        username: '',
        userId: '',
        userTickName: '',
        rightId: '',
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
      this.rightEditDialogType = 'edit'
      this.editRightInfo = row
      console.log(row)
      this.showRightEditDialog = true
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
     * 新增权限弹窗回调
     * @return {void}
     */
    handleAddRight () {
      this.rightEditDialogType = 'add'
      this.showRightEditDialog = true
    },
    /**
     * 删除权限回调
     * @return {void}
     */
    async handleDelRight () {
      if (this.selectList.length === 0) {
        message.warning('请选择权限')
        return
      }
      const ids = this.selectList.map(i => i.rightId)
      try {
        await $axios.post($api.setting.deleteRight, {
          rightInfo: JSON.stringify({
            rightId: ids.join(',')
          })
        })
        message.success('删除权限成功')
        this.load()
      } catch (err) {
        message.error('删除权限失败')
      }
    },
    /**
     * 弹窗确定回调
     * @param {string} type 成功关闭类别
     * @return {void}
     */
    editConfirm (type) {
      this.showRightEditDialog = false
      if (type === 'new') {
        message.success('新增权限成功')
      } else {
        message.success('修改权限成功')
      }
      this.searchFun()
    },
    /**
     * 多选回调
     * @param {array} list 成功关闭类别
     * @return {void}
     */
    handleSelectionChange (list) {
      this.selectList = list
    }
  },
  mounted () {
    this.load()
  },
  components: {
    SearchBox,
    RightEditDialog,
    PlusOutlined,
    DeleteOutlined,
    'a-table': Table,
    'a-pagination': Pagination,
    'a-breadcrumb': Breadcrumb,
    'a-breadcrumb-item': Breadcrumb.Item,
    'a-range-picker': DatePicker.RangePicker
  }
}
</script>

<style lang="scss" scoped>
.rightManage {
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

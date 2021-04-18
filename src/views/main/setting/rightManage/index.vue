<template>
  <div class="rightManage">
    <a-breadcrumb separator-class="a-icon-arrow-right">
      <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.value">{{item.label}}</a-breadcrumb-item>
    </a-breadcrumb>
    <SearchBox>
      <template v-slot:main>
        <a-form ref="registerForm" :model="form" layout="inline" @submit.prevent :label-col="{style: 'width: 100px' }" :wrapper-col="{style: 'width: 265px' }"  labelAlign="right">
          <a-form-item label="权限名" name="rightName" class="search-box-item">
            <a-input v-model:value="form.rightName" style="width: 80%"></a-input>
          </a-form-item>
          <a-form-item label="权限id" name="rightId" class="search-box-item">
            <a-input v-model:value="form.rightId" style="width: 80%"></a-input>
          </a-form-item>
          <a-form-item label="创建日期" name="createTime" class="search-box-item">
            <a-range-picker
              v-model:value="form.createTime"
              format="yyyy/MM/dd"
              style="width: 80%"
            >
            </a-range-picker>
          </a-form-item>
          <div class="search-btn-box search-box-item">
            <a-button class="search" type="primary" @click="loadPage" >搜索</a-button>
            <a-button class="reset" type="default" @click="resetForm" >重置条件</a-button>
          </div>
        </a-form>
      </template>
    </SearchBox>
    <div class="btn-box">
      <a-button type="primary" @click="handleAddRight" shape="round" class="edit">
        <template #icon><PlusOutlined /></template>新增
      </a-button>
      <a-button type="danger" @click="handleDelRight" shape="round">
        <template #icon><DeleteOutlined /></template>删除
      </a-button>
    </div>
    <a-table
      ref="multipleTable"
      rowKey="rightId"
      style="width: 100%"
      class="multipleTable"
      childrenColumnName="childrenRow"
      :data-source="rightList"
      :columns="columns"
      :pagination="false"
      :scroll="{ x: 1200 }"
      :loading="loading"
      :row-selection="rowSelection"
      @sort-change="handleSortChange"
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
    <a-back-top />
    <RightEditDialog
      v-model="showRightEditDialog"
      :type="rightEditDialogType"
      :data="editRightInfo"
      @update="editConfirm"
    ></RightEditDialog>
  </div>
</template>

<script>
import { message, Table, Pagination, Breadcrumb, DatePicker, BackTop } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import Utils from '@/lib/utils.js'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import SearchBox from '@/components/modules/SearchBox'
import RightEditDialog from './RightEditDialog'
import { ref, onMounted, toRaw } from 'vue'
import { usePage, useTableSort, useSearchForm, useDetailModal } from '../hooks'
export default {
  name: 'rightManage',
  setup () {
    const breadcrumbList = [
      {
        label: '用户设置',
        value: '1'
      },
      {
        label: '权限管理',
        value: '12'
      }
    ]
    const { page, handleSizeChange, handleCurrentChange, loadPage } = usePage(load)
    const rightList = ref([])
    // 权限弹窗
    const rightEditDialog = useDetailModal('add')
    const showRightEditDialog = rightEditDialog.show
    const rightEditDialogType = rightEditDialog.type
    const editRightInfo = rightEditDialog.info
    const handleAddRight = rightEditDialog.openModal('add')
    const handleEdit = rightEditDialog.openInfoModal('edit')
    /**
     * 表格选中项
     */
    const selectList = ref([])
    /**
     * 删除权限回调
     * @return {void}
     */
    const handleDelRight = async () => {
      if (selectList.value.length === 0) {
        message.warning('请选择权限')
        return
      }
      const ids = selectList.value.map(i => i.rightId)
      try {
        await $axios.post($api.setting.deleteRight, {
          rightId: ids.join(',')
        })
        message.success('删除权限成功')
        load()
      } catch (err) {
        message.error('删除权限失败')
      }
    }
    /**
     * 表格行定义
     */
    const columns = [
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
    /**
     * 表格选中事件
     */
    const handleSelectionChange = (list) => {
      selectList.value = list
    }
    /**
     * 表格选中定义
     */
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        handleSelectionChange(selectedRows)
      }
    }
    /**
     * 表格排序
     */
    const {
      sortCol,
      sortOrder,
      handleSortChange
    } = useTableSort('rightId', 'ASC', load)
    const { form, resetForm } = useSearchForm({
      rightName: '',
      rightId: '',
      createTime: []
    })
    /**
     * 弹窗确定回调
     * @param {string} type 成功关闭类别
     * @return {void}
     */
    const editConfirm = (type) => {
      showRightEditDialog.value = false
      if (type === 'new') {
        message.success('新增权限成功')
      } else {
        message.success('修改权限成功')
      }
      loadPage()
    }
    const loading = ref(false)
    /**
     * 加载函数
     */
    async function load () {
      const { rightName, rightId, createTime } = form
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
      console.log('请求接口')
      try {
        loading.value = true
        const res = await $axios.post($api.setting.getRightList, {
          rightId: rightId,
          rightName: rightName,
          createTime: createTimeList.join(','),
          orderName: sortCol.value,
          orderType: sortOrder.value,
          index: currentPage,
          pageSize
        })
        const result = res.data.list.map(item => {
          item.createTime = Utils.timeFormat(new Date(item.createTime), 'yyyy-MM-dd hh:mm:ss') || ''
          return item
        })
        rightList.value = result
        page.total = res.data.total
        selectList.value = []
        loading.value = false
      } catch (err) {
        loading.value = false
        message.error(' 加载列表数据失败！')
      }
    }
    onMounted(() => { load() })
    return {
      page,
      handleSizeChange,
      handleCurrentChange,
      rowSelection,
      selectList,
      rightList,
      breadcrumbList,
      rightEditDialogType,
      editRightInfo,
      form,
      columns,
      showRightEditDialog,
      handleSelectionChange,
      sortCol,
      sortOrder,
      handleSortChange,
      loading,
      loadPage,
      resetForm,
      handleAddRight,
      handleDelRight,
      handleEdit,
      editConfirm
    }
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
    'a-range-picker': DatePicker.RangePicker,
    'a-back-top': BackTop
  }
}
</script>

<style lang="scss" scoped>
.rightManage {
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
    .edit {
      margin-right: 10px;
    }
  }
  .pagination-box {
    display: block;
    text-align: center;
    padding: 20px 0;
  }
}
</style>

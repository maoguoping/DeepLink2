<template>
  <div class="list-view">
    <a-table
      ref="multipleTable"
      :data-source="viewData"
      :columns="columns"
      :pagination="false"
      :row-selection="rowSelection"
      :loading="loading"
      childrenColumnName="childrenRow"
      class="multipleTable"
      rowKey="id"
    >
      <!-- <template type="selection" width="55"></template> -->
      <template #name="{ name }" sortable width="120">{{name}}</template>
      <template #modifyTime="{ modifyTime }" label="" sortable="custom" width="120">
        {{modifyTime}}
      </template>
      <template #tags="{text: tags}">
        <span>
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag }}
          </a-tag>
        </span>
      </template>
      <template #description="{ text }" label="介绍" show-overflow-tooltip> {{text}}</template>
      <template #action="{ record }" width="180">
        <div class="table-operation">
          <a-button size="small" @click="handleRead(record)" class="table-btn">查看</a-button>
          <a-dropdown :trigger="['click']">
            <a-button size="small" class="a-dropdown-link table-btn">编辑</a-button>
            <template #overlay>
              <a-menu @click="handleCommand($event, record)">
                <a-menu-item key="move">移动</a-menu-item>
                <a-menu-item key="edit">修改</a-menu-item>
                <a-menu-item key="delete">删除</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </template>
    </a-table>
    <div class="pagination-box" v-if="viewData==''?false:viewData.length>0">
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
  </div>
</template>
<script>
import Utils from '@/lib/utils.js'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { message, Dropdown, Table, Pagination, Tag, Menu } from 'ant-design-vue'
import { reactive, toRefs, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { usePage } from '@/hooks/page'
import { useTableSort } from '@/hooks/table'
export default {
  name: 'list-view',
  props: {
    defaultLoad: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup (props, { emit }) {
    const store = useStore()
    const { defaultLoad } = toRefs(props)
    const pathId = computed(() => store.state.manageCenterStore.manageCenterPathId)
    const router = useRouter()
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.handleSelectionChange(selectedRows)
      }
    }
    const { page, handleSizeChange, handleCurrentChange, loadPage } = usePage(loadViewData)
    const {
      sortCol,
      sortOrder,
      handleSortChange
    } = useTableSort('modifyTime', 'ASC', loadViewData)
    const state = reactive({
      rowSelection,
      viewData: [],
      msg: 'Welcome to Your Vue.js App',
      multipleSelection: [],
      loading: false
    })
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '修改日期',
        dataIndex: 'modifyTime',
        key: 'modifyTime'
      },
      {
        title: '标签',
        key: 'tags',
        dataIndex: 'tags',
        slots: { customRender: 'tags' }
      },
      {
        title: '介绍',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: '操作',
        key: 'action',
        slots: { customRender: 'action' }
      }
    ]
    /**
     *查看事件
     * @param {Object} row 行数据
     * @return {void}
     */
    const handleRead = (row) => {
      emit('view-read', row)
      console.log('view-read', row)
      page.currentPage = 1
      store.dispatch('changeManageCenterPath', {
        pathId: row.pathId,
        pathName: decodeURI(row.path),
        type: row.type
      })
      router.push({
        path: '/manageCenter',
        query: {
          pathId: Utils.pathStrEncode(row.pathId),
          type: row.type
        }
      })
    }
    /**
     *下拉框事件
     */
    const handleCommand = ({ key }, record) => {
      console.log(key, record)
      emit(key, record)
    }
    /**
     * 选择变化回调
     * @param {Array} valList 返回id列表
     * @return {void}
     */
    const handleSelectionChange = (valList) => {
      state.multipleSelection = valList
      emit('mul-section', valList)
    }
    const filterTag = (value, row) => {
      return row.tag === value
    }
    /**
     * 表格行class生成
     * @param row
     * @param rowIndex
     * @return {string}
     */
    const tableRowClassName = (record, index) => {
      console.log('record', record)
      if (record.typeId === 0) {
        return 'folder'
      } else if (record.typeId === 1) {
        return 'element'
      } else {
        return 'project'
      }
    }
    // const pathStr = computed(() => store.state.manageCenterStore.manageCenterPath)
    /**
     *加载表格
     * @return {void}
     */
    async function loadViewData () {
      try {
        state.loading = true
        const res = await $axios.post($api.manageCenter.getViewDataByPathId, {
          pathId: pathId.value || '',
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          sortBy: sortCol.value,
          order: sortOrder.value
        })
        const result = res.data.list.map(item => {
          item.modifyTime = Utils.timeFormat(new Date(item.modifyTime), 'yyyy-MM-dd')
          item.tags = item.tag.split(',')
          item.children = []
          return item
        })
        console.log(result)
        page.total = res.data.total
        state.viewData = result
        emit('on-change', {
          type: 'update',
          viewType: 'listView',
          viewDescription: res.data.listDescription
        })
        state.loading = false
      } catch (err) {
        state.loading = false
        message.error('加载数据错误')
      }
    }
    onMounted(() => {
      //            var path=""
    //            if(manageCenterName!=this.pathStr){
    //                path=this.pathStr;
    //            }
    //            this.   (path);
      defaultLoad.value && loadPage()
    })
    watch(pathId, (val) => {
      loadViewData()
    })
    watch(defaultLoad, (val) => {
      val && loadPage()
    })
    return {
      ...toRefs(state),
      pathId,
      columns,
      page,
      handleCurrentChange,
      handleSizeChange,
      loadViewData,
      loadPage,
      sortCol,
      sortOrder,
      handleSortChange,
      handleRead,
      handleCommand,
      handleSelectionChange,
      filterTag,
      tableRowClassName
    }
  },
  components: {
    'a-dropdown': Dropdown,
    'a-table': Table,
    'a-pagination': Pagination,
    'a-tag': Tag,
    'a-menu': Menu,
    'a-menu-item': Menu.Item
  }
}
</script>
<style lang="scss" type="text/scss">
.list-view {
  .multipleTable {
    border: 1px solid #dcdfe6;
  }
  .header {
    background-color: #d3d3d3;
  }
  .element {
    background-color: #ffe4e1;
  }
  .folder {
    background-color: #ffffe0;
  }
  .project {
    background-color: #f0ffff;
  }
}
</style>
<style lang="scss" scoped type="text/scss">
.list-view {
  ul {
    li {
      height: 60px;
      line-height: 60px;
      border: 1px solid #eeeeee;
      /*display: inline-block;*/
    }
  }
  .table-operation {
    display: flex;
    justify-content: center;
    .table-btn {
      margin-right: 15px;
    }
  }
  .pagination-box {
    display: block;
    text-align: center;
    padding: 20px 0;
  }
}
</style>

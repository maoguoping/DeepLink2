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
import { mapState, mapMutations } from 'vuex'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { message, Dropdown, Table, Pagination, Tag, Menu } from 'ant-design-vue'

export default {
  name: 'list-view',
  props: {
    defaultLoad: {
      type: Boolean,
      required: false,
      default: true
    }
  },
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
      sortBy: 'modifyTime',
      order: 'DESC',
      viewData: [],
      msg: 'Welcome to Your Vue.js App',
      multipleSelection: [],
      columns: [
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
      ],
      loading: false
    }
  },
  computed: {
    ...mapState({
      pathStr: state => state.manageCenterStore.manageCenterPath,
      pathId: state => state.manageCenterStore.manageCenterPathId
    })
  },
  components: {
    'a-dropdown': Dropdown,
    'a-table': Table,
    'a-pagination': Pagination,
    'a-tag': Tag,
    'a-menu': Menu,
    'a-menu-item': Menu.Item
  },
  methods: {
    ...mapMutations(['changeManageCenterPath']),
    /**
     * 更新列表数据
     * @return {void}
     */
    updateView () {
      this.page.currentPage = 1
      this.loadViewData()
    },
    /**
     * 选择变化回调
     * @param {Array} valList 返回id列表
     * @return {void}
     */
    handleSelectionChange (valList) {
      this.multipleSelection = valList
      this.$emit('mul-section', valList)
    },
    /**
     * 分页页面size变化回调
     * @param {Number} val 更改数字
     * @return {void}
     */
    handleSizeChange (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.loadViewData()
    },
    /**
     * 分页页码变化回调
     * @param {Number} val 更改数字
     * @return {void}
     */
    handleCurrentChange (val) {
      console.log('handleCurrentChange', val)
      this.page.currentPage = val
      this.loadViewData()
    },
    /**
     * 分页排序变化回调
     * @param {Object} event 更改事件
     * @return {void}
     */
    handelSortChange (event) {
      this.sortBy = event.prop
      this.order = event.order === 'ascending' ? 'ASC' : 'DESC'
      this.loadViewData()
    },
    filterTag (value, row) {
      return row.tag === value
    },
    /**
     *查看事件
     * @param {Object} row 行数据
     * @return {void}
     */
    handleRead (row) {
      this.$emit('view-read', row)
      this.page.currentPage = 1
      this.changeManageCenterPath({
        pathId: row.pathId,
        pathName: decodeURI(row.path),
        type: row.type
      })
      this.$router.push({
        path: '/manageCenter',
        query: {
          pathId: Utils.pathStrEncode(row.pathId),
          path: Utils.pathStrEncode(encodeURI(row.path)),
          type: row.type
        }
      })
    },
    /**
     *下拉框事件
     */
    handleCommand ({ key }, record) {
      console.log(key, record)
      switch (key) {
        case 'edit': {
          this.$emit('edit', record)
          break
        }
        case 'delete': {
          this.$emit('delete', record)
          break
        }
        case 'move': {
          this.$emit('move', record)
          break
        }
      }
    },
    /**
     *加载表格
     * @return {void}
     */
    async loadViewData () {
      const pathId = this.pathId || ''
      try {
        this.loading = true
        const res = await $axios.post($api.manageCenter.getViewDataByPathId, {
          pathId: pathId,
          pageInfo: JSON.stringify({
            currentPage: this.page.currentPage,
            pageSize: this.page.pageSize,
            sortBy: this.sortBy,
            order: this.order
          })
        })
        const result = res.data.list.map(item => {
          item.modifyTime = Utils.timeFormat(new Date(item.modifyTime), 'yyyy-MM-dd')
          item.tags = item.tag.split(',')
          item.children = []
          return item
        })
        console.log(result)
        this.page.total = res.data.total
        this.viewData = result
        this.$emit('on-change', {
          type: 'update',
          viewType: 'listView',
          viewDescription: res.data.listDescription
        })
        this.loading = false
      } catch (err) {
        this.loading = false
        message.error('加载数据错误')
      }
    },
    /**
     * 表格行class生成
     * @param row
     * @param rowIndex
     * @return {string}
     */
    tableRowClassName (record, index) {
      console.log('record', record)
      if (record.typeId === 0) {
        return 'folder'
      } else if (record.typeId === 1) {
        return 'element'
      } else {
        return 'project'
      }
    }
  },
  created () {},
  mounted () {
    //            var path=""
    //            if(manageCenterName!=this.pathStr){
    //                path=this.pathStr;
    //            }
    //            this.   (path);
    this.defaultLoad && this.updateView()
  },
  watch: {
    pathId (val) {
      this.loadViewData()
    },
    defaultLoad (val) {
      val && this.updateView()
    }
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
    margin-top: 20px;
  }
}
</style>

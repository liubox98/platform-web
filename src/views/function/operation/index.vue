<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="id"
        style="width: 140px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span style="margin-right: 10px;" />

      <el-select v-model="listQuery.task_name" clearable placeholder="选择任务">
        <el-option
          v-for="item in task_type"
          :key="item.task_id__name"
          :label="item.task_id__name"
          :value="item.task_id__name"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-select v-model="listQuery.modules" clearable placeholder="选择模块">
        <el-option
          v-for="item in modules_type"
          :key="item.modules"
          :label="item.modules"
          :value="item.modules"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-select v-model="listQuery.status" clearable placeholder="选择状态">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-select v-model="listQuery.priority" clearable placeholder="选择优先级">
        <el-option
          v-for="item in priority"
          :key="item.priority"
          :label="item.priority"
          :value="item.priority"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-select v-model="listQuery.creator" clearable placeholder="选择编写人">
        <el-option
          v-for="item in creator"
          :key="item.creator"
          :label="item.creator"
          :value="item.creator"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-select v-model="listQuery.performer" clearable placeholder="选择指派人">
        <el-option
          v-for="item in performer"
          :key="item.performer"
          :label="item.performer"
          :value="item.performer"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <p />
    <div v-if="roleButtonVisable" class="filter-container2">
      <el-select v-model="temp.performer" clearable placeholder="选择指派人">
        <el-option
          v-for="item in user_list"
          :key="item.username"
          :label="item.username"
          :value="item.username"
          style="width: 190px;"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-s-promotion"
        @click="updateMultiplePerformer()"
      >用例分配</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="warning"
        icon="el-icon-s-release"
        @click="updatePerformer()"
      >用例收回</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-warning"
        @click="deleteCase()"
      >删除用例</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="success"
        icon="el-icon-document"
        @click="downloadCase()"
      >导出用例</el-button>
    </div>
    <p />
    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        min-width="80px"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.modules }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例名" align="center" min-width="200px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前置条件" align="center" min-width="280px">
        <template slot-scope="{row}">
          <span>{{ row.precondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤" header-align="center" min-width="200px">
        <template slot-scope="{row}">
          <span style="white-space:pre-wrap">{{ row.steps }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编写人" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行人" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.performer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.update_time | msgDateFormat('yyyy-mm-dd hh-mi-ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="shouldShowPagination"
      small
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :loading="loading"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { caseOperation, assignCaseOperation, updateCaseOperation, deleteCase } from '@/api/case'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      multipleSelection: [],
      assign_name: undefined,
      user_list: undefined,
      task_modules: null,
      caseModelsData: [],
      status: '',
      priority: undefined,
      creator: undefined,
      performer: undefined,
      type: undefined,
      file: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      listQuery: {
        id: undefined,
        name: '',
        page: 1,
        limit: 20,
        title: undefined,
        sort: '+id'
      },
      statusOptions: [{ value: '执行通过', label: '执行通过' }, { value: '执行失败', label: '执行失败' }, { value: '未执行', label: '未执行' }, { value: '需求过期', label: '需求过期' }, { value: '暂未实现', label: '暂未实现' }, { value: '需求变更', label: '需求变更' }],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: '',
        task_name: ''
      },
      modules_type: undefined,
      task_type: undefined,
      dialogFormVisible: false,
      uploadFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      loading: true,
      roleButtonVisable: true
    }
  },
  computed: {
    shouldShowPagination() {
      return this.total > this.listQuery.limit && this.total > 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      caseOperation(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.modules_type = response.data.modules_type
        this.task_type = response.data.task_type
        this.status = response.data.status
        this.priority = response.data.priority
        this.creator = response.data.creator
        this.performer = response.data.performer
        this.update_time = response.data.update_time
        this.user_list = response.data.user_list
        this.loading = false
      })
      const roles = this.$store.getters.roles
      if (roles.includes('admin')) {
        this.roleButtonVisable = true
      } else {
        this.roleButtonVisable = false
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleUpload(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'upload'
      this.uploadFormVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updateMultiplePerformer() {
      const tempData = []
      this.multipleSelection.forEach(item => {
        tempData.push({ 'id': item.id, 'performer': this.temp.performer })
      })
      if (tempData.length === 0) {
        this.$notify({
          title: 'Warning',
          message: '先选中用例再分配！',
          type: 'warning',
          duration: 2000
        })
        return
      }
      if (this.temp.performer === undefined) {
        this.$notify({
          title: 'Warning',
          message: '先选中指派人再分配！',
          type: 'warning',
          duration: 2000
        })
        return
      }
      assignCaseOperation(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '用例分配成功！',
          type: 'success',
          duration: 2000
        })
        this.list.forEach(item => {
          item['performer'] = this.temp.performer
        })
      })
      this.$refs.multipleTable.clearSelection()
    },
    updatePerformer() {
      const tempData = []
      this.multipleSelection.forEach(item => {
        tempData.push({ 'id': item.id })
      })
      if (tempData.length === 0) {
        this.$notify({
          title: 'Warning',
          message: '先选中用例再收回！',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.$confirm('此操作将不可撤回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateCaseOperation(tempData).then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '用例收回成功！',
            type: 'success',
            duration: 2000
          })
          this.list.forEach(item => {
            item['performer'] = null
          })
        })
        this.$refs.multipleTable.clearSelection()
      })
    },
    deleteCase(index) {
      const tempData = []
      this.multipleSelection.forEach(item => {
        tempData.push({ 'id': item.id })
      })
      if (tempData.length === 0) {
        this.$notify({
          title: 'Warning',
          message: '先选中用例再删除！',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.$confirm('此操作将不可撤回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCase(tempData).then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '删除用例成功！',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, tempData.length)
          this.list.findIndex(v => v.id === this.temp.id)
          if (tempData.length === 20) {
            location.reload()
          }
          this.$refs.multipleTable.clearSelection()
        })
      })
    },
    downloadCase() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '任务名', '模块', '用例名', '前置条件', '步骤', '状态', '优先级', '编写人', '执行人', '执行时间']
        const filterVal = ['id', 'task_name', 'modules', 'name', 'precondition', 'steps', 'status', 'priority', 'creator', 'performer', 'update_time']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用例详情',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>

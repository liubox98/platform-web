<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="id"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span style="margin-right: 10px;" />

      <el-select
        v-model="listQuery.task_name"
        clearable
        placeholder="选择任务"
      >
        <el-option
          v-for="item in task_type"
          :key="item.task_id__name"
          :label="item.task_id__name"
          :value="item.task_id__name"
          style="width: 190px"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-select
        v-model="listQuery.modules"
        clearable
        placeholder="选择模块"
      >
        <el-option
          v-for="item in modules_type"
          :key="item.modules"
          :label="item.modules"
          :value="item.modules"
          style="width: 190px"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>
    <p />
    <el-table
      :key="randomKey"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" align="center" min-width="160">
        <template slot-scope="{ row }">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块" align="center" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.modules }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例名" align="center" min-width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前置条件" header-align="center" min-width="240px">
        <template slot-scope="{ row }">
          <span style="white-space: pre-wrap">{{ row.precondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤" header-align="center" min-width="240px">
        <template slot-scope="{ row }">
          <span style="white-space: pre-wrap">{{ row.steps }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预期结果" header-align="center" min-width="200px">
        <template slot-scope="{ row }">
          <span style="white-space: pre-wrap">{{ row.results }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="180px">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="danger"
            @click="handleDeleteQuetion(row, $index)"
          >
            删除
          </el-button>
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
import { getProblemCase, deleteProblemCase } from '@/api/case'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      multipleSelection: [],
      assign_name: undefined,
      user_list: undefined,
      task_modules: null,
      caseModelsData: [],
      file: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      listQuery: {
        id: undefined,
        page: 1,
        limit: 20,
        title: undefined,
        sort: '+id'
      },
      statusOptions: [
        { value: '执行通过', label: '执行通过' },
        { value: '执行失败', label: '执行失败' },
        { value: '未执行', label: '未执行' },
        { value: '需求过期', label: '需求过期' },
        { value: '暂未实现', label: '暂未实现' },
        { value: '需求变更', label: '需求变更' }
      ],
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
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      randomKey: Math.random(),
      loading: true
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
      getProblemCase(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        this.modules_type = response.data.modules_type
        this.task_type = response.data.task_type
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDeleteQuetion(row, index) {
      deleteProblemCase(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除问题用例成功！',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    myUpload(param) {
      this.file = param.file
      console.log('file', this.file)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

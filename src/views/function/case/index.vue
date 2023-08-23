<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag
        v-for="item in tags"
        :key="item.prop_rete"
      >
        {{ '【' + item.name + '】' + ' ' + '执行进度：' + item.prop_rete + '%' }}
      </el-tag>
      <p />
      <el-input
        v-model="listQuery.id"
        placeholder="id"
        style="width: 200px;"
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

      <el-select v-model="listQuery.unexecuted_modules" clearable placeholder="选择未执行模块">
        <el-option
          v-for="item in unexecuted_module"
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

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <p />
    <div class="filter-container1">
      <el-select v-model="temp.status" clearable placeholder="修改状态">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          style="width: 190px;"
        />
      </el-select>
      <span style="margin-right: 10px;" />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="updateMultipleStatus"
      >全部修改</el-button>
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
      <el-table-column type="selection" width="40" />
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.modules }}</span>
        </template>
      </el-table-column>
      <el-table-column label="子模块" align="center" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.submodule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例名" align="center" min-width="200px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前置条件" header-align="center" min-width="240px">
        <template slot-scope="{row}">
          <span style="white-space:pre-wrap">{{ row.precondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="步骤" header-align="center" min-width="240px">
        <template slot-scope="{row}">
          <span style="white-space:pre-wrap">{{ row.steps }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预期结果" header-align="center" min-width="210px">
        <template slot-scope="{row}">
          <span style="white-space:pre-wrap">{{ row.results }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-select v-model="row.status" size="mini" placeholder="选择" :class="getStatusColorClass(row.status)" @change="handleModifyStatus(row, row.status)">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              <span :style="{ color: item.color }">{{ item.value }}</span>
            </el-option>
          </el-select>
          <el-button size="mini" type="danger" @click="open(row, $index)">
            问题用例
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
<style lang="scss">
.passed input {
  color: #008000;
}
.failed input {
  color: #FF0000;
}
.undone input {
  color: #E6A23C;
}
.expire input {
  color: #C0C4CC;
}
.change input {
  color: #808080;
}
</style>
<script>
import { fetchList, updateCase, updateProblemCase } from '@/api/case'
import waves from '@/directive/waves' // waves directive
import store from '@/store'
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
      file: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      // listLoading: true,
      listQuery: {
        id: undefined,
        page: 1,
        limit: 20,
        title: undefined,
        sort: '+id'
      },
      statusOptions: [{ label: '执行通过', value: '执行通过', color: '#008000' }, { label: '执行失败', value: '执行失败', color: '#FF0000' }, { label: '未执行', value: '未执行', color: '#000000' }, { label: '暂未实现', value: '暂未实现', color: '#E6A23C' }, { label: '需求过期', value: '需求过期', color: '#C0C4CC' }, { label: '需求变更', value: '需求变更', color: '#808080' }],
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
      tags: undefined,
      modules_type: undefined,
      unexecuted_module: undefined,
      task_type: undefined,
      task_status: undefined,
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
      textarea: '',
      questionTemp: {
        id: undefined,
        remark: ''
      },
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
    getStatusColorClass(status) {
      if (status === '执行通过') {
        return 'passed'
      } else if (status === '执行失败') {
        return 'failed'
      } else if (status === '暂未实现') {
        return 'undone'
      } else if (status === '需求过期') {
        return 'expire'
      } else if (status === '需求变更') {
        return 'change'
      }
    },
    getList() {
      this.loading = true
      fetchList(this.listQuery, { 'username': store.getters.name }).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.modules_type = response.data.modules_type
        this.unexecuted_module = response.data.unexecuted_module
        this.task_type = response.data.task_type
        this.task_status = response.data.task_status
        this.tags = response.data.task_tags
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      const tempData = []
      tempData.push({ 'id': row.id, 'status': status })
      updateCase(tempData).then(() => {
        // const index = this.list.findIndex(v => v.id === this.temp.id)
        // this.list.splice(index, 1, this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '用例状态更新成功！',
          type: 'success',
          duration: 2000
        })
      })
      row.status = status
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
        status: '',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCase(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '用例状态更新成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    open(row) {
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '备注不能为空'
      }).then((value) => {
        this.questionTemp.id = row.id
        this.questionTemp.remark = value['value']
        updateProblemCase(this.questionTemp).then(() => {
          this.$message({
            type: 'success',
            message: '用例上报成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消上报'
        })
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleUpload(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'upload'
      this.uploadFormVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // console.log(this.temp.status)
    },
    updateMultipleStatus() {
      const tempData = []
      const tempIdList = []
      const indexs = []
      this.multipleSelection.forEach(item => {
        tempData.push({ 'id': item.id, 'status': this.temp.status })
        tempIdList.push(item.id)
      })
      if (tempData.length === 0) {
        this.$notify({
          title: 'Warning',
          message: '先选中用例再更新',
          type: 'warning',
          duration: 2000
        })
        return
      }
      if (this.temp.status === '') {
        this.$notify({
          title: 'Warning',
          message: '先选中状态再修改',
          type: 'warning',
          duration: 2000
        })
        return
      }
      updateCase(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '用例状态更新成功！',
          type: 'success',
          duration: 2000
        })
        tempIdList.forEach(item => {
          indexs.push(this.list.findIndex(v => v.id === item))
        })
        indexs.forEach(index => {
          this.list[index].status = this.temp.status
          // this.list.splice(index, 1, this.list[index].status)
        })
      })
      this.$refs.multipleTable.clearSelection()
      // console.log(ids, this.temp.status)
    }
  }
}
</script>

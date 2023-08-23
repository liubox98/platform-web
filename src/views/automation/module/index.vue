<template>
  <div class="app-container">
    <el-input
      v-model="listQuery.name"
      placeholder="任务"
      style="width: 200px"
      class="filter-item"
      @keyup.enter.native="handleFilter"
    />
    <span style="margin-right: 10px;" />

    <el-select v-model="listQuery.creator" clearable placeholder="选择创建人">
      <el-option
        v-for="creat in creator"
        :key="creat"
        :label="creat"
        :value="creat"
        style="width: 190px"
        class="filter-item"
      />
    </el-select>
    <span style="margin-right: 10px;" />
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      查询
    </el-button>
    <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-plus" @click="handleCreate">
      添加
    </el-button>
    <p />
    <el-table
      :key="tableKey"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" min-width="30" :class-name="getSortClass('id')">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" align="center" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建" align="center" min-width="30px">
        <template slot-scope="{ row }">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" min-width="50px">
        <template slot-scope="{ row }">
          <span>{{
            row.start_time | msgDateFormat('yyyy-mm-dd hh-mi-ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" min-width="50px">
        <template slot-scope="{ row }">
          <span>{{ row.end_time | msgDateFormat('yyyy-mm-dd hh-mi-ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" min-width="40px">
        <template slot-scope="{ row }">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="30px">
        <template slot-scope="{ row }">
          <el-tag :type="{ 完成: 'success' }[row.status]" size="medium">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="85" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <router-link
            :to="'/automation/assign/' + row.id"
            tag="button"
            icon="el-icon-s-operation"
            class="el-button el-button--primary el-button--mini"
          >
            分配
          </router-link>
          <router-link
            icon="el-icon-s-operation"
            :to="'/automation/details/' + row.id"
            tag="button"
            class="el-button el-button--primary el-button--mini"
          >
            详情
          </router-link>
          <el-button v-if="roleButtonVisable" size="mini" type="danger" @click="handleDelete(row, $index)">删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="任务名" prop="name">
          <el-input v-model="temp.name" placeholder="输入任务名" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker v-model="temp.start_time" type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker v-model="temp.end_time" type="datetime" placeholder="选择截至时间" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" placeholder="点击输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchAtutoList, createAuto, updateAuto, deleteAuto } from '@/api/auto'

export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      creator: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      total: 0,
      tableKey: Date.now(),
      loading: true,
      roleButtonVisable: true,
      statusOptions: ['进行中', '调试中', '维护中', '完成'],
      temp: {
        id: undefined,
        name: '',
        start_time: new Date(),
        end_time: new Date(),
        status: '',
        performer: '',
        description: '',
        casenumber: 0,
        creator: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      update_grade: [],
      rules: {
        name: [{ required: true, message: '输入任务名', trigger: 'blur' }],
        start_time: [
          { required: true, message: '选择开始时间', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '选择结束时间', trigger: 'blur' }
        ]
      }
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
      fetchAtutoList(this.listQuery).then((response) => {
        this.list = response.data.result
        this.total = response.data.total
        this.creator = response.data.creator_list
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        remark: '',
        timestamp: new Date(),
        performer: '',
        casenumber: 0
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.creator = this.$store.state.user.name
          createAuto(this.temp).then((res) => {
            if (res.msg === '任务重复') {
              this.$notify({
                title: 'Error',
                message: '任务存在！重新命名',
                type: 'error',
                duration: 2000
              })
              return
            }
            this.temp.id = res.data.id
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '任务创建成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAuto(tempData).then((res) => {
            if (res.msg === '任务重复') {
              this.$notify({
                title: 'Error',
                message: '任务存在！重新命名',
                type: 'error',
                duration: 2000
              })
              return
            }
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '任务修改成功！',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      const tempData = { id: row['id'] }
      this.$confirm('此操作不可撤回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAuto(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '任务删除成功！',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
            this.list.findIndex((v) => v.id === this.temp.id)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

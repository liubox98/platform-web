<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.task_name"
        placeholder="输入任务名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span style="margin-right: 10px;" />

      <el-select
        v-model="listQuery.task_creator"
        clearable
        placeholder="选择创建人"
      >
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

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>
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
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        min-width="100"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" align="center" min-width="160px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始" align="center" min-width="170px">
        <template slot-scope="{ row }">
          <span>{{
            row.start_time | msgDateFormat('yyyy-mm-dd hh-mi-ss')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束" align="center" min-width="170px">
        <template slot-scope="{ row }">
          <span>{{ row.end_time | msgDateFormat('yyyy-mm-dd hh-mi-ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" min-width="300px">
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.prop_rete }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <el-tag :type="{ '进行中': 'warning', '已归档': 'success' }[row.status]" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button
            v-if="roleButtonVisable"
            type="primary"
            size="mini"
            @click="handleUpload(row)"
          >
            上传用例
          </el-button>
          <router-link
            v-if="roleButtonVisable"
            :to="'/function/assign/' + row.id"
            tag="button"
            class="el-button el-button--primary el-button--mini"
          >
            分配
          </router-link>
          <router-link
            :to="'/function/taskDetails/' + row.id"
            tag="button"
            class="el-button el-button--primary el-button--mini"
          >
            详情
          </router-link>
          <p />
          <el-button
            v-if="roleButtonVisable"
            size="mini"
            type="info"
            @click="resetCaseStatus(row)"
          >
            重置
          </el-button>
          <el-button
            v-if="roleButtonVisable"
            size="mini"
            type="warning"
            @click="retractCase(row)"
          >
            收回
          </el-button>
          <el-button
            v-if="roleButtonVisable"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
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
          <el-date-picker
            v-model="temp.start_time"
            type="datetime"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束" prop="end_time">
          <el-date-picker
            v-model="temp.end_time"
            type="datetime"
            placeholder="选择截至时间"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="选择"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="grade">
          <el-checkbox-group v-model="temp.grade">
            <el-checkbox label="高" name="grade" />
            <el-checkbox label="中" name="grade" />
            <el-checkbox label="低" name="grade" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="temp.description" placeholder="点击输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!-- 上传用例dialog -->
    <el-dialog
      v-loading="listLoading"
      :title="textMap[dialogStatus]"
      :visible.sync="uploadFormVisible"
    >
      <el-form ref="uploadForm" label-width="80px">
        <el-form-item label="ID" prop="id">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="任务名" prop="name">
          <el-input v-model="temp.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :http-request="myUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="onChange"
            :on-success="uploadSuccess"
            :show-file-list="true"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload">立即创建</el-button>
          <el-button @click="cancelUpload">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createArticle,
  updateArticle,
  deleteArticle,
  resetCaseStatus,
  retractCase
} from '@/api/task'
import { uploadCase } from '@/api/case'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      assign_name: undefined,
      user_list: undefined,
      task_modules: null,
      caseModelsData: [],
      file: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      creator: undefined,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        name: undefined,
        type: undefined,
        sort: '+id'
      },
      statusOptions: ['进行中', '已归档'],
      temp: {
        id: undefined,
        importance: 1,
        description: '',
        timestamp: new Date(),
        type: '',
        status: '',
        name: '',
        creator: '',
        start_time: new Date(),
        end_time: new Date(),
        grade: ['高', '中', '低']
      },
      dialogFormVisible: false,
      uploadFormVisible: false,
      assignFormVisible: false,
      dialogStatus: '',
      roleButtonVisable: true,
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
        ],
        status: [
          { required: true, message: '选择任务状态', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '至少选择一项', trigger: 'blur' }
        ]
      },
      fileList: [],
      computed: {
        ...mapGetters(['name'])
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
    getList() {
      this.loading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        this.creator = response.data.creators
        // Just to simulate the time of the request
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
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
        description: '',
        timestamp: new Date(),
        name: '',
        status: '',
        type: '',
        grade: ['高', '中', '低']
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
          this.temp.grade = this.temp.grade.toString()
          createArticle(this.temp).then((res) => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      const array = Array.from(this.temp.grade)
      array.forEach((element) => {
        var index = array.indexOf(',')
        if (index > -1) {
          array.splice(index, 1)
        }
      })
      this.temp.grade = array
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          tempData.grade = this.temp.grade.toString()
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then((res) => {
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
            this.getList()
            this.$notify({
              title: 'Success',
              message: '任务修改成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      const tempData = { id: row['id'] }
      this.$confirm('此操作将同时删除对应任务下的全部用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteArticle(tempData).then(() => {
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
    handleExceed() {
      this.$message.warning(`当前仅限选择 1 个文件！`)
    },
    submitUpload() {
      if (this.fileList.length === 0) {
        this.$notify({
          title: 'Warning',
          message: '请先上传用例',
          type: 'warning',
          duration: 2000
        })
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$refs.upload.submit()
      const fd = new FormData() // FormData 对象
      // this.fd = fd
      // 该方法会执行myUpload方法
      this.$refs.upload.submit()
      fd.append('id', this.temp.id)
      fd.append('name', this.temp.name)
      fd.append('file', this.file)
      uploadCase(fd).then((res) => {
        loading.close()
        this.$refs['upload'].clearFiles()
        this.$refs['upload'].clearFiles()
        this.uploadFormVisible = false
        if (res.msg !== 'success') {
          this.$notify.error({
            title: '上传失败',
            message: res.msg,
            duration: 0
          })
        } else {
          this.getList()
          this.$notify({
            title: 'Success',
            message: '上传用例成功！',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    cancelUpload() {
      console.log('upload:', this.$refs['upload'])
      this.$refs['upload'].clearFiles()
      this.uploadFormVisible = false
    },
    myUpload(param) {
      this.file = param.file
    },
    onChange(fileList) {
      this.fileList = fileList
    },
    uploadSuccess: function(fileList) {
      this.fileList = fileList
    },
    resetCaseStatus(row) {
      const tempData = { id: row['id'] }
      this.$confirm('此操作将重置任务下所有用例的状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          resetCaseStatus(tempData).then((res) => {
            if (res.msg === '用例未上传') {
              this.$notify({
                title: 'Warning',
                message: '请先上传用例再执行重置操作',
                type: 'warning',
                duration: 2000
              })
              return
            }
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: '重置用例状态成功！',
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    retractCase(row) {
      const tempData = { id: row['id'] }
      this.$confirm('此操作将重置任务下面所有用例的分配人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          retractCase(tempData).then((res) => {
            if (res.msg === '用例未上传') {
              this.$notify({
                title: 'Warning',
                message: '请先上传用例再执行收回操作',
                type: 'warning',
                duration: 2000
              })
              return
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '任务用例收回成功！',
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消收回'
          })
        })
    }
  }
}
</script>

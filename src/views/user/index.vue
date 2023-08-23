<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
    </div>
    <p />
    <el-table :key="tableKey" :data="user_list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span class="bold-text">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="id" align="center" width="150">
        <template slot-scope="{row}">
          <span class="bold-text">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" prop="id" align="center" width="150">
        <template slot-scope="{row}">
          <span class="bold-text">{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行测试任务" prop="id" align="center" width="150">
        <template slot-scope="{row}">
          <span class="bold-text">{{ row.is_tester }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="small" @click="handleUpdate(row, $index)">
            修改
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="small" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="权限" prop="role_name">
          <el-select v-model="temp.role_name" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="测试人员" prop="is_tester">
          <el-radio-group v-model="temp.is_tester" size="small">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'Create' ? createData() : confirmUpdate()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getUserList, deleteUser, addUser, updateUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ComplexTable',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: { update: 'Edit', create: 'Create' },
      tableKey: 0,
      user_list: [],
      role_list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      temp: { id: '', username: '', role_name: '', is_tester: undefined, role_id: undefined },
      roleOptions: ['admin', 'qa'],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        role_name: [
          { required: true, message: '请选择权限', trigger: 'blur' }
        ],
        is_tester: [
          { required: true, message: '请选择是否测试人员', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getUserList().then((res) => {
        this.user_list = res.data.user_list
        this.total = res.data.total
        this.role_list = res.data.role_list
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
          this.user_list.splice(index, 1)
          this.total = this.total - 1
          this.$notify({
            title: 'Success',
            message: '人员删除成功！',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'Edit'
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        role_name: '',
        is_tester: undefined,
        role_id: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'Create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const role_name = this.temp.role_name
          let temp_role
          this.role_list.forEach(item => {
            if (item.name === role_name) {
              temp_role = item
            }
          })
          this.temp.role_id = temp_role.id
          addUser(this.temp).then(res => {
            if (res.msg === '人员存在') {
              this.$notify({
                title: 'Error',
                message: '用户存在！请重新添加',
                type: 'error',
                duration: 2000
              })
              return
            }
            this.temp.id = res.data.id
            this.user_list.push(this.temp)
            this.dialogFormVisible = false
            this.total = this.total + 1
            this.$notify({
              title: 'Success',
              message: '用户添加成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    confirmUpdate() {
      const role_name = this.temp.role_name

      let temp_role
      this.role_list.forEach(item => {
        if (item.name === role_name) {
          temp_role = item
        }
      })
      this.temp.role_id = temp_role.id
      updateUser(this.temp).then(() => {
        this.dialogFormVisible = false
        const index = this.user_list.findIndex(v => v.id === this.temp.id)
        this.user_list.splice(index, 1, this.temp)
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
<style>
.bold-text {
  font-weight: bold;
}
</style>

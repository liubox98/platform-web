<template>
  <div v-loading="loading" element-loading-text="拼命加载中" class="app-container">
    <div class="filter-container">
      <el-input v-model="query_parms.modules_name" placeholder="模块名" style="width: 200px;" class="filter-item" />
      <span style="margin-right: 10px;" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleModulesSearch">
        查询
      </el-button>
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="success" icon="el-icon-document" @click="handleDownload">
        导出 Excel
      </el-button>
    </div>
    <el-table
      :data="task_modules"
      style="width: 100%"
    >
      <el-table-column
        prop="modules"
        label="模块"
        width="180"
      />
      <el-table-column
        prop="modules__count"
        label="用例数量"
        width="180"
      />
      <el-table-column
        prop="task_id__name"
        label="任务名"
        width="180"
      />
      <el-table-column label="分配" width="220">
        <el-select v-model="row.performer" slot-scope="{row}" clearable placeholder="请选择" @change="handleChangeAssign(row.performer, row.task_id, row.modules)">
          <el-option
            v-for="user in user_list"
            :key="user.username"
            :label="user.username"
            :value="user.username"
            style="width: 200px;"
          />
        </el-select>
      </el-table-column>
      <!-- <el-table-column label="优先级" width="200">
        <template slot-scope="{row}">
          <el-checkbox-group v-model="query_parms.grade" @change="updateGrade(row.task_id, row.modules)">
            <el-checkbox label="高" name="grade" />
            <el-checkbox label="中" name="grade" />
            <el-checkbox label="低" name="grade" />
          </el-checkbox-group>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="moduleDelete(row.task_id, row.modules, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAssignCase, chagneAssign, chagneAssignDelete, getAssignCaseV1 } from '@/api/case'
import waves from '@/directive/waves'
export default {
  directives: { waves },
  data() {
    return {
      task_modules: [],
      user_list: undefined,
      task_id: undefined,
      change_list: [],
      query_parms: {
        id: undefined,
        modules_name: undefined
      },
      downloadLoading: false,
      loading: true
    }
  },
  created() {
    this.task_id = this.$route.params.id
    this.query_parms.id = this.$route.params.id
    getAssignCase(this.query_parms).then((res) => {
      this.task_modules = res.data.task_modules
      this.user_list = res.data.user_list
      this.query_parms.grade = res.data.task_grade
      this.loading = false
    })
  },
  methods: {
    handleChangeAssign(name, task_id, modules) {
      const temp = [{ 'name': name, 'task_id': task_id, 'modules': modules }]
      chagneAssign(temp).then((res) => {
        const tempIndex = []
        let tempModuleNum = 0
        let temp = 0
        this.task_modules.forEach((item, index) => {
          if (item.modules === modules) {
            tempIndex.push(index)
            tempModuleNum = tempModuleNum + item.modules__count
          }
        })
        tempIndex.forEach((item, index) => {
          if (index !== 0) {
            if (temp === 0) {
              temp = temp + 1
            }
            if (temp >= 1) {
              this.task_modules.splice(item - temp, 1)
              temp = temp + 1
            }
          }
        })
        this.task_modules[tempIndex[0]].modules__count = tempModuleNum
        if (name !== '') {
          this.$notify({
            title: 'Success',
            message: '用例分配成功！',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: 'Success',
            message: '模块重置成功！',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleModulesSearch() {
      getAssignCaseV1(this.query_parms).then((res) => {
        this.task_modules = res.data.task_modules
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['模块', '用例数量', '任务名', '分配']
        const filterVal = ['modules', 'modules__count', 'task_id__name', 'performer']
        const list = this.task_modules
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '分配详情',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    moduleDelete(task_id, modules, index) {
      const temp = [{ 'task_id': task_id, 'modules': modules }]
      this.$confirm('此操作将不可撤回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chagneAssignDelete(temp).then(() => {
          this.$notify({
            title: 'Success',
            message: '删除模块成功！',
            type: 'success',
            duration: 2000
          })
          this.task_modules.splice(index, 1)
        })
      })
    }
  }
}
</script>

<style>

</style>

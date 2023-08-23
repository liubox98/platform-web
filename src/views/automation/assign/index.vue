<template>
  <div v-loading="loading" element-loading-text="拼命加载中" class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query_parms.modules"
        placeholder="模块"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span style="margin-right: 10px;" />
      <el-button v-waves disabled class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="success" icon="el-icon-document" @click="handleDownload">
        导出 Excel
      </el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="modules"
        label="模块"
        width="180"
      />
      <el-table-column
        prop="number"
        label="数量"
        width="180"
      />
      <el-table-column
        prop="maintain"
        label="维护人"
        width="180"
      />
      <el-table-column label="执行人" width="220">
        <el-select v-model="row.executor" slot-scope="{row}" clearable placeholder="点击选择" @change="handleChangeAssign(task_id, row.modules, row.number, row.executor, row.maintain)">
          <el-option
            v-for="user in user_list"
            :key="user"
            :label="user"
            :value="user"
            style="width: 200px;"
          />
        </el-select>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" disabled @click="moduleDelete(row.task_id, row.modules, row.number,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAssignModule, chagneAssign } from '@/api/auto'
import waves from '@/directive/waves'
export default {
  directives: { waves },
  data() {
    return {
      list: [],
      user_list: undefined,
      change_list: [],
      query_parms: {
        id: undefined,
        modules: undefined
      },
      downloadLoading: false,
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.task_id = this.$route.params.id
      this.query_parms.id = this.$route.params.id
      getAssignModule(this.query_parms).then((response) => {
        this.list = response.data.result
        this.user_list = response.data.users
        this.loading = false
      })
    },
    handleChangeAssign(id, modules, number, executor, maintain) {
      chagneAssign({ 'id': id, 'modules': modules, 'number': number, 'executor': executor, 'maintain': maintain }).then(() => {
        if (executor !== '') {
          this.$notify({
            title: 'Success',
            message: '模块分配成功！',
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
    handleFilter() {
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['name', 'modules', 'number', 'executor', 'maintain']
        const filterVal = ['name', 'modules', 'number', 'executor', 'maintain']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '自动化分配详情',
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
    }
  }
}
</script>

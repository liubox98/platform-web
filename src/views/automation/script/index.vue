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
    <el-input
      v-model="listQuery.module"
      placeholder="模块"
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
        @keyup.enter.native="handleFilter"
      />
    </el-select>
    <span style="margin-right: 10px;" />
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      查询
    </el-button>
    <p />
    <template v-if="list && list.length">
      <el-table
        :key="tableKey"
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- <el-table-column
          label="ID"
          prop="id"
          align="center"
          min-width="40px"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="任务" align="center" min-width="80px">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模块" align="center" min-width="80px">
          <template slot-scope="{ row }">
            <span>{{ row.modules }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" min-width="50px">
          <template slot-scope="{ row }">
            <span>{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="维护" align="center" min-width="40px">
          <template slot-scope="{ row }">
            <span>{{ row.maintain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报告" min-width="300px">
          <template slot-scope="{ row }">
            <el-input v-model="row.report" type="textarea" autosize placeholder="点击粘贴URL:" @blur="updateTestingReport(row)" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="60px">
          <template slot-scope="{ row }">
            <el-radio-group v-model="row.status" size="small" @change="handleStatusUpdate(row, row.status)">
              <el-radio-button label="已通过" :disabled="statusUpdating" class="status-radio" />
              <el-radio-button label="未通过" :disabled="statusUpdating" class="status-radio" />
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="shouldShowPagination"
        small
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </template>
    <template v-else>
      <el-empty :image-size="200" description="No data" />
    </template>
  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { implement, updateReport, updateStatus } from '@/api/auto'

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
      total: 0,
      creator: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      tableKey: Date.now(),
      loading: false,
      roleButtonVisable: true,
      updateTimer: null,
      statusUpdating: false
    }
  },
  computed: {
    shouldShowPagination() {
      return this.total > this.listQuery.limit && this.total > 0
    }
  },
  watch: {
    list() {
      clearTimeout(this.updateTimer)
      this.updateTimer = null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const response = await implement(this.listQuery, { username: this.$store.state.user.name })
        this.list = response.data.result
        this.total = response.data.total
        this.creator = response.data.creator_list
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        this.loading = false
      }
    },
    updateTestingReport(row) {
      if (!this.updateTimer) {
        this.updateTimer = setTimeout(() => {
          this.updateTimer = null
          updateReport({ id: row.id, report: row.report })
            .then(() => {
              this.$message({
                type: 'success',
                message: 'Report update successful'
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: 'cancel report update'
              })
            })
        }, 1000)
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getSortClass(column) {},
    handleStatusUpdate(row, optionValue) {
      if (this.statusUpdating) {
        return
      }
      this.statusUpdating = true

      updateStatus({ id: row.id, status: optionValue })
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Status update successful'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel status update'
          })
        })
        .finally(() => {
          this.statusUpdating = false
          this.getList()
        })
    }
  }
}
</script>

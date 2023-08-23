<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container">
        <el-select v-model="listQuery.task" clearable placeholder="选择任务">
          <el-option
            v-for="(item, index) in task_type"
            :key="index"
            :label="item"
            :value="item"
            style="width: 190px;"
            class="filter-item"
            @selection-change="handleSelectionChange"
          />
        </el-select>
        <span style="margin-right: 10px;" />

        <el-select v-model="listQuery.modules" clearable placeholder="选择模块">
          <el-option
            v-for="(item, index) in modules_type"
            :key="index"
            :label="item"
            :value="item"
            style="width: 190px;"
            class="filter-item"
            @selection-change="handleSelectionChange"
          />
        </el-select>
        <span style="margin-right: 10px;" />

        <el-select v-model="listQuery.status" clearable placeholder="选择状态">
          <el-option
            v-for="(item, index) in statusOptions"
            :key="index"
            :label="item"
            :value="item"
            style="width: 190px;"
            class="filter-item"
            @selection-change="handleSelectionChange"
          />
        </el-select>
        <span style="margin-right: 10px;" />

        <el-select v-model="listQuery.maintain" clearable placeholder="选择维护人">
          <el-option
            v-for="(item, index) in maintain_list"
            :key="index"
            :label="item"
            :value="item"
            style="width: 190px;"
            class="filter-item"
            @selection-change="handleSelectionChange"
          />
        </el-select>
        <span style="margin-right: 10px;" />

        <el-select v-model="listQuery.executor" clearable placeholder="选择执行人">
          <el-option
            v-for="(item, index) in executor_list"
            :key="index"
            :label="item"
            :value="item"
            style="width: 190px;"
            class="filter-item"
            @selection-change="handleSelectionChange"
          />
        </el-select>
        <span style="margin-right: 10px;" />

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-document"
          @click="downloadCase()"
        >导出 Excel</el-button>
        <p />
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="任务" align="center" min-width="150px">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模块" align="center" min-width="150px">
          <template slot-scope="{row}">
            <span>{{ row.modules }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="report" label="报告" align="center" min-width="800">
          <template slot-scope="scope">
            <div v-for="(link, index) in scope.row.reportLinks" :key="index">
              <template v-if="link.startsWith('http')">
                <template v-if="link.includes('|')">
                  <a :href="link.split('|')[0]" target="_blank">
                    <el-link type="success">{{ link.split('|')[0] }}</el-link>
                  </a>
                  {{ link.split('|')[1] }}
                </template>
                <template v-else>
                  <el-link :href="link" target="_blank" type="success">{{ link }}</el-link>
                </template>
              </template>
              <template v-else>
                {{ link }}
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="80px">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status === '已通过'" type="success" size="medium">{{ row.status }}</el-tag>
            <el-tag v-else-if="row.status === '未通过'" type="danger" size="medium">{{ row.status }}</el-tag>
            <span v-else>{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="维护人" align="center" min-width="80px">
          <template slot-scope="{row}">
            <span>{{ row.maintain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行人" align="center" min-width="80px">
          <template slot-scope="{row}">
            <span>{{ row.executor }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" align="center" min-width="80px">
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
  </div>
</template>

<script>
import { autoOperation } from '@/api/auto'
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
      list: [],
      task_type: [],
      modules_type: [],
      statusOptions: [],
      maintain_list: [],
      executor_list: [],

      listQuery: {
        page: 1,
        sort: '+id'
      },
      multipleSelection: [],
      downloadLoading: false,
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
      autoOperation(this.listQuery).then(response => {
        this.list = response.data.result
        this.task_type = response.data.name_list
        this.modules_type = response.data.module_list
        this.statusOptions = response.data.status_list
        this.maintain_list = response.data.maintain_list
        this.executor_list = response.data.executor_list
        this.loading = false

        // Process report links
        this.list.forEach((item) => {
          if (item.report && typeof item.report === 'string') {
            item.reportLinks = item.report.split('http').filter((link) => link.trim() !== '')
            item.reportLinks = item.reportLinks.map((link) => 'http' + link.trim())
          }
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    downloadCase() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['任务', '模块', '状态', '报告', '维护人', '执行人', '执行时间']
        const filterVal = ['name', 'modules', 'status', 'report', 'maintain', 'executor', 'update_time']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '自动化执行总览',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>


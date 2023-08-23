<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.version" clearable placeholder="版本">
        <el-option
          v-for="version in versions"
          :key="version"
          :label="version"
          :value="version"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <el-select v-model="listQuery.confire" clearable placeholder="状态">
        <el-option
          v-for="item in statusKey"
          :key="item.select"
          :label="item.select"
          :value="item.confire"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <el-select v-model="listQuery.isIgnore" clearable placeholder="忽略标记">
        <el-option
          v-for="item in isIgnoreKey"
          :key="item.select"
          :label="item.select"
          :value="item.isIgnore"
          style="width: 190px;"
          class="filter-item"
          @selection-change="handleSelectionChange"
        />
      </el-select>
      <el-input
        v-model="listQuery.name"
        placeholder="提交人"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="commit hash" prop="commit_hash" align="center" width="350">
        <template slot-scope="{row}">
          <span>{{ row.commit_hash }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交信息" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.detail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分支" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.confire ? 'success' : 'warning'">
            {{ getStatusText(row.confire) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否忽略（不需要合并的提交勾选）" class-name="status-col" align="center" width="120">
        <template slot-scope="{row}">
          <div @click="changeIsIgnore(row)">
            <el-switch
              v-model="row.isIgnore"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="!row.confire" size="mini" type="success" @click="handleModifyStatus(row,true)">
            确认已合并
          </el-button>
          <el-button v-if="row.confire" size="mini" @click="handleModifyStatus(row,false)">
            重置状态
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-if="shouldShowPagination" small :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchCommitList, updateCommitStatus, updateIgnoreStatus } from '@/api/commit'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      versions: undefined,
      statusKey: [{ 'confire': true, 'select': '已确认合并' }, { 'confire': false, 'select': '未确认' }],
      isIgnoreKey: [{ 'isIgnore': true, 'select': '已忽略' }, { 'isIgnore': false, 'select': '未忽略' }],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        version: undefined,
        confire: false,
        isIgnore: false,
        name: undefined,
        page: 1,
        limit: 20
      },
      statusOptions: ['已合并', '未确认'],
      showReviewer: false
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
      this.listLoading = true
      fetchCommitList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.versions = response.data.version_list
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getStatusText(status) {
      let selectValue = ''

      for (const item of this.statusKey) {
        if (item.confire === status) {
          selectValue = item.select
          return selectValue
        }
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      const tempData = []
      tempData.push({ 'commit_hash': row.commit_hash, 'confire': status })
      updateCommitStatus(tempData).then(response => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.confire = status
      })
    },
    changeIsIgnore(row) {
      const tempData = { 'commit_hash': row.commit_hash, 'isIgnore': row.isIgnore }
      updateIgnoreStatus(tempData).then(response => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
      })
    }
  }
}
</script>

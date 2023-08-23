<template>
  <div v-loading="loading" element-loading-text="拼命加载中" class="app-container">
    <el-tag>【开始时间】{{ start_time|msgDateFormat('yyyy-mm-dd hh-mi-ss') }}</el-tag> <el-tag type="danger">【截至日期】{{ end_time|msgDateFormat('yyyy-mm-dd hh-mi-ss') }}</el-tag>
    <el-table :data="list" border style="min-width: 100%">
      <el-table-column prop="name" label="任务" align="center" min-width="100" />
      <el-table-column prop="modules" label="模块" align="center" min-width="150" />
      <el-table-column prop="number" label="数量" align="center" min-width="100" />
      <el-table-column prop="report" label="报告" align="center" min-width="600">
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
      <el-table-column prop="maintain" label="维护" align="center" min-width="100" />
      <el-table-column prop="executor" label="执行" align="center" min-width="100" />
    </el-table>
  </div>
</template>

<script>
import { getDetails } from '@/api/auto'
import waves from '@/directive/waves'

export default {
  directives: { waves },
  data() {
    return {
      list: [],
      query_parms: {
        id: undefined
      },
      start_time: undefined,
      end_time: undefined,
      loading: true
    }
  },
  created() {
    this.query_parms.id = this.$route.params.id
    getDetails(this.query_parms).then((response) => {
      this.list = response.data.result
      this.start_time = response.data.start_time
      this.end_time = response.data.end_time
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
  methods: {
  }
}
</script>

<template>
  <div v-loading="loading" element-loading-text="拼命加载中" class="app-container">
    <el-tag>【开始时间】{{ start_time }}</el-tag> <el-tag type="danger">【截至日期】{{ end_time }}</el-tag> <el-tag>【用例总数】{{ case_sum }}</el-tag> <el-tag type="warning">【未分配数】{{ unassigned }}</el-tag> <el-tag type="success">【通过数量】{{ passed }}</el-tag> <el-tag type="info">【失败数量】{{ failed }}</el-tag> <el-tag type="info">【需求过期】{{ expire }}</el-tag> <el-tag type="info">【未实现数】{{ undone }}</el-tag> <el-tag type="info">【需求变更】{{ change }}</el-tag> <el-tag type="info">【未执行数】{{ unexecuted }}</el-tag> <el-tag>【总执行率】{{ prop_rete }}</el-tag>
    <el-table :data="datas" border style="min-width: 100%">
      <el-table-column prop="name" label="姓名" align="center" min-width="100" />
      <el-table-column prop="task_name" label="任务名" align="center" min-width="150" />
      <el-table-column prop="case_module" label="用例模块" align="center" min-width="600">
        <template slot-scope="scope">
          <div :style="{ color: '#03c03c' }">
            <span> {{ scope.row.case_module.TRUE | format }} </span>
          </div>
          <span> {{ scope.row.case_module.FALSE | format }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="prop_rete" label="执行比例" align="center" min-width="100" />
      <el-table-column prop="fenpei" label="分配数量" align="center" min-width="100" />
      <el-table-column prop="passed" label="通过数量" align="center" min-width="100" />
      <el-table-column prop="failed" label="失败数量" align="center" min-width="100" />
      <el-table-column prop="expire" label="需求过期" align="center" min-width="100" />
      <el-table-column prop="undone" label="未实现数" align="center" min-width="100" />
      <el-table-column prop="change" label="需求变更" align="center" min-width="100" />
      <el-table-column prop="unexecuted" label="未执行数" align="center" min-width="100" />
    </el-table>
  </div>
</template>

<script>
import { taskDetails } from '@/api/case'
import waves from '@/directive/waves'
export default {
  directives: { waves },
  filters: {
    format(value) {
      if (value) {
        const str = value.toString()
        const newArr = str.split(' ').map(ele => {
          return ele.charAt(0).toUpperCase() + ele.slice(1)
        })
        return newArr.join(' ')
      }
    }
  },
  data() {
    return {
      datas: [],
      task_id: undefined,
      task_name: undefined,
      case_module: [],
      query_parms: {
        id: undefined
      },
      start_time: undefined,
      end_time: undefined,
      case_sum: undefined,
      unassigned: undefined,
      passed: undefined,
      failed: undefined,
      expire: undefined,
      undone: undefined,
      change: undefined,
      unexecuted: undefined,
      prop_rete: '',
      loading: true
    }
  },
  created() {
    this.task_id = this.$route.params.id
    this.query_parms.id = this.$route.params.id
    taskDetails(this.query_parms).then((res) => {
      this.datas = res.data.datas
      this.start_time = res.data.start_time.replace(/T/g, ' ').replace(/Z/g, '')
      this.end_time = res.data.end_time.replace(/T/g, ' ').replace(/Z/g, '')
      this.case_sum = res.data.Overall[0]
      this.unassigned = res.data.Overall[1]
      this.passed = res.data.Overall[2]
      this.failed = res.data.Overall[3]
      this.expire = res.data.Overall[4]
      this.undone = res.data.Overall[5]
      this.change = res.data.Overall[6]
      this.unexecuted = res.data.Overall[7]
      this.prop_rete = res.data.Overall[8]
      this.loading = false
    })
  },
  methods: {
  }
}
</script>

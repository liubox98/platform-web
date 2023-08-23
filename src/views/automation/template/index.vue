<template>
  <div>
    <el-table v-loading="loading" :data="list.filter(data => !search || data.modules.toLowerCase().includes(search.toLowerCase()))" style="width: 52%">
      <el-table-column label="模块" prop="module" align="center">
        <template slot-scope="scope">
          <template v-if="!scope.row.editing">
            {{ scope.row.modules }}
          </template>
          <template v-else>
            <el-input v-model="scope.row.modules" size="mini" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="number" align="center">
        <template slot-scope="scope">
          <template v-if="!scope.row.editing">
            {{ scope.row.number }}
          </template>
          <template v-else>
            <el-input v-model="scope.row.number" size="mini" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="maintain" align="center">
        <template slot-scope="scope">
          <template v-if="!scope.row.editing">
            {{ scope.row.status }}
          </template>
          <template v-else>
            <el-input v-model="scope.row.status" size="mini" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="维护" prop="maintain" align="center">
        <template slot-scope="scope">
          <template v-if="!scope.row.editing">
            {{ scope.row.maintain }}
          </template>
          <template v-else>
            <el-input v-model="scope.row.maintain" size="mini" />
          </template>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <!-- eslint-disable-next-line vue/no-unused-vars -->
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="🔍模块查询"
            class="custom-input"
            border-color:
          />
        </template>

        <template slot-scope="scope">
          <template v-if="!scope.row.editing">
            <el-button size="mini" icon="el-icon-edit" @click="startEdit(scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
          <template v-else>
            <el-button size="mini" type="success" icon="el-icon-circle-check" @click="saveEdit(scope.$index, scope.row)">保存</el-button>
            <el-button size="mini" type="info" icon="el-icon-circle-close" @click="cancelEdit(scope.$index, scope.row)">退出</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <p />
    <el-button type="primary" size="mini" icon="el-icon-plus" style="width: 52%" @click="addRow">点击添加</el-button>
  </div>
</template>

<script>
import { tempList, tempDelete, tempUpdate, tempCreate } from '@/api/auto'

export default {
  data() {
    return {
      list: [],
      originalData: [],
      search: '',
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const response = await tempList()
      this.list = response.data.result.map((item) => ({
        ...item,
        editing: false,
        isNew: false
      }))
      this.originalData = JSON.parse(JSON.stringify(this.list))
      this.loading = false
    },
    addRow() {
      const newId = this.list.length > 0 ? Math.max(...this.list.map((item) => item.id)) + 1 : 1
      const newRow = {
        id: newId,
        modules: '',
        number: '',
        status: '正常',
        maintain: this.$store.state.user.name,
        editing: true,
        isNew: true
      }
      this.list.push(newRow)
    },
    startEdit(index) {
      this.list[index].editing = true
    },
    cancelEdit(index, row) {
      if (row.isNew) {
        this.list.splice(index, 1)
      } else {
        Object.assign(row, this.originalData[index])
      }
    },
    async saveEdit(index, row) {
      if (!row.modules || !row.number || !row.maintain || isNaN(Number(row.number))) {
        this.$message({
          type: 'warning',
          message: '包含空值或数量不是有效数字'
        })
        return
      }
      let response
      if (row.isNew) {
        response = await tempCreate({ id: row.id, modules: row.modules, number: row.number, maintain: row.maintain, status: row.status })
      } else {
        response = await tempUpdate({ id: row.id, modules: row.modules, number: row.number, maintain: row.maintain, status: row.status })
      }
      if (response.msg === '模块存在') {
        this.$message({
          type: 'info',
          message: '模块存在'
        })
        return
      }
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.list[index].editing = false
      this.list[index].isNew = false
    },
    async handleDelete(index, row) {
      try {
        await tempDelete({ id: row.id })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.list.splice(index, 1)
      } catch (error) {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
    }
  }
}
</script>
<style>
.custom-input .el-input__inner {
  border-color: #409EFF
}
</style>

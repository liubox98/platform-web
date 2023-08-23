<template>
  <div class="app-container common-list-page">
    <div id="dashboard-text" class="dashboard-text" />
    <p />
    <el-form
      ref="resetForm"
      :model="resetForm"
      :rules="resetFormRules"
      status-icon
      label-width="100px"
      class="reset-form"
    >
      <el-form-item label="旧密码：" prop="password">
        <el-input
          v-model="resetForm.password"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item label="新密码：" prop="newpwd">
        <el-input
          v-model="resetForm.newpwd"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item label="确认密码：" prop="newpassword1">
        <el-input
          v-model="resetForm.newpassword1"
          type="password"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" round @click.native.prevent="toAmend">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePassword } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6-18位'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.newpwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      resetForm: {
        newpassword1: '',
        password: '',
        username: this.$store.getters.name
      },
      resetFormRules: {
        password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newpwd: [{ required: true, validator: validatePass, trigger: 'blur' }],
        newpassword1: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    var dashboardText = document.getElementById('dashboard-text')
    var hiValues = [
      'Hi there',
      '嗨，你好',
      'Hallo',
      'Salut',
      'Ciao',
      'Hola, chicos',
      '안녕하세요',
      'أهلاً بك يا',
      'Hai',
      'สวัสดี',
      'こんにちは',
      'Привет',
      'Olá',
      'Merhaba',
      'नमस्ते',
      'Chào bạn',
      'Hallo daar'
    ]
    var randomIndex = Math.floor(Math.random() * hiValues.length)
    var randomHi = hiValues[randomIndex]
    dashboardText.textContent = randomHi + ' ' + this.name
  },
  methods: {
    toAmend() {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          updatePassword(this.resetForm).then((res) => {
            if (res.msg === 'fail') {
              this.$message({
                message: '密码错误，请重新输入',
                type: 'error',
                duration: '2000'
              })
              return false
            }
            if (res.msg === 'success') {
              this.$message.success('修改成功,3秒后跳转到登录页！')
              setTimeout(() => {
                this.logout()
              }, 3000)
            }
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-text {
  display: flex;
  font-size: 28px;
}
.reset-form {
  width: 25%;
}
</style>

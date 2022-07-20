<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form v-loading="loading" :model="baseInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="baseInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="baseInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <i class="el-icon-printer" style="font-size:30px" @click="$router.push(`/employees/print/${userId}?type=personal`)" />
            </el-row>
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <i class="el-icon-printer" style="font-size:30px" @click="$router.push(`/employees/print/${userId}`)" />
            </el-row>
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserBaseInfo, saveUserBaseInfo } from '@/api/employees'
import UserInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'
export default {
  filters: {},
  components: { UserInfo, JobInfo },
  data() {
    return {
      userId: this.$route.params.id,
      baseInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
        password2: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserBaseInfo()
  },
  methods: {
    async getUserBaseInfo() {
      this.loading = true
      this.baseInfo = await getUserBaseInfo(this.userId)
      this.loading = false
    },
    async saveInfo() {
      this.loading = true
      await saveUserBaseInfo({ ...this.baseInfo, password: this.baseInfo.password2, id: this.userId })
      this.$message.success('用户基本信息更新成功')
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>

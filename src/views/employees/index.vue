<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 自定义top组件 -->
      <TopTool :show-left="true">
        <span slot="left">共{{ page.total }}条数据</span>
        <template slot="right">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="outEmployees">导出</el-button>
          <el-button size="small" type="primary" @click="addEmployee">新增员工</el-button>
        </template>
      </TopTool>
      <!-- 表格组件 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" sortable="" prop="staffPhoto">
            <template slot-scope="{row}">
              <img v-imagerror="defaultimg" :src="row.staffPhoto" alt="" class="avator" @click="showcode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="电话" sortable="" prop="mobile" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="hireformatter" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              {{ row.timeOfEntry|formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <el-switch
                :value="row.enableState===1"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignroles(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 新增员工弹框 -->
    <AddEmployee :show-dialog.sync="showDialog" @addEmploy="getEmployees" />
    <el-dialog v-loading="loading1" title="二维码" :visible.sync="showQrcode">
      <el-row type="flex" justify="center">
        <canvas ref="imgqrcode" />
      </el-row>
    </el-dialog>
    <AssignRole ref="assignrole1" :show-role.sync="showRole" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployees, delEmployee } from '@/api/employees'
import constant from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/AddEployee.vue'
import { formatDate } from '@/filters'
import hireType from '@/api/constant/employees'
import QrCode from 'qrcode'
import AssignRole from '@/views/employees/components/AssignRole.vue'

export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      defaultimg: require('@/assets/common/22.png'),
      showQrcode: false,
      loading1: false,
      showRole: false,
      userId: ''
    }
  },
  created() {
    this.getEmployees()
  },
  methods: {
    // 获取员工列表
    async getEmployees() {
      this.loading = true
      const { rows, total } = await getEmployees(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    // 点击分页数显示不同的数据
    changePage(num) {
      this.page.page = num
      this.getEmployees()
    },
    // 设置聘用形式的形式，通过表格列的:formatter
    hireformatter(row, column, cellValue, index) {
      console.log(Number(cellValue))
      // find方法找到符合的item项返回
      const val = constant.hireType.find(item => item.id === Number(cellValue))
      console.log(val)
      return val ? val.value : '未知'
    },
    // 根据id删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗？')
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployees()
      } catch (error) {
        console.log(error)
      }
    },
    // 添加员工
    addEmployee() {
      this.showDialog = true
    },
    async outEmployees() {
      console.log('导出')
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getEmployees({ page: 1, size: this.page.total })
      const datas = rows.map(item => {
        return Object.keys(headers).map(item1 => {
          if (headers[item1] === 'timeOfEntry' || headers[item1] === 'correctionTime') {
            item[headers[item1]] = formatDate(item[headers[item1]])
          } else if (headers[item1] === 'formOfEmployment') {
            const obj1 = hireType.hireType.find(obj => obj.id === item[headers[item1]])
            if (obj1) {
              item[headers[item1]] = obj1.value
            } else {
              item[headers[item1]] = '未知'
            }
          }
          return item[headers[item1]]
        })
      })
      console.log(datas)
      import('@/vendor/Export2Excel').then((excel) => {
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: datas,
          filename: '员工信息表'
        })
      })
    },
    // 点击图片显示二维码
    showcode(img) {
      console.log(12121)
      console.log(img)
      if (img !== ' ') {
        this.showQrcode = true
        this.loading1 = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.imgqrcode, img)
        })
        this.loading1 = false
      } else {
        this.$message.warning('当前用户没有头像')
      }
    },
    async assignroles(id) {
      console.log(id)
      this.userId = id
      console.log(this.$refs.assignrole1)
      await this.$refs.assignrole1.getUserDetailinfo(id)
      this.showRole = true
    }
  }
}
</script>

<style>
.avator {
  width: 80px;
  height:80px;
  border-radius: 50%;
}
</style>

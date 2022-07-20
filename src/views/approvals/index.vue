<template>
  <div class="dashboard-container">
    <div class="app-container">
      <TopTool :show-left="true">
        <span slot="left">
          <span>当前审批中 0 </span>
          <span>本月审批通过 1 </span>
          <span>本月审批驳回 1</span>
        </span>
        <span slot="right">
          <el-button type="primary" size="small">流程设置</el-button>
        </span>
      </TopTool>
      <el-card>
        <el-table
          :data="list"
          style="width: 100%"
          :default-sort="{prop: 'procApplyTime', order: 'descending'}"
        >
          <el-table-column
            type="index"
            label="序号"
            sortable
            width="180"
          />
          <el-table-column
            prop="processName"
            label="审批类型"
            sortable
            width="180"
          />
          <el-table-column
            prop="username"
            label="申请人"
            sortable
            width="180"
          />
          <el-table-column
            prop="procCurrNodeUserName"
            label="当前审批人"
          />
          <el-table-column
            prop="procApplyTime"
            label="审批发起时间"
          >
            <template slot-scope="{row}">
              {{ row.procApplyTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="processState"
            label="审批状态"
            :formatter="states"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="{row}">
              <el-button type="text" @click="$router.push(`approvals/processDetail/${row.processId}`)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-row slot="footer" type="flex" justify="center" align="middle" style="height:60px">
        <el-col :span="6">
          <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :current-page="page.page"
            :page-size="page.size"
            @current-change="pagechange"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getApprovalsList } from '@/api/approvals.js'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 2,
        total: 0
      }
    }
  },
  created() {
    this.getApprovalsList()
  },
  methods: {
    async getApprovalsList() {
      const { rows, total } = await getApprovalsList(this.page)
      console.log(rows)
      this.list = rows
      this.page.total = total
    },
    pagechange(num) {
      console.log(num)
      this.page.page = num
      this.getApprovalsList()
    },
    states(row) {
      if (row.processState === '1') {
        return '审批中'
      }
      if (row.processState === '2') {
        return '审批通过'
      }
      if (row.processState === '3') {
        return '审批不通过'
      }
      if (row.processState === '4') {
        return '撤销'
      }
    }
  }
}
</script>

<style>

</style>

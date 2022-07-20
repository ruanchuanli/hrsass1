<template>
  <div class="dashboard-container">
    <div class="app-container">
      <TopTool>
        <span slot="right">
          <el-button type="primary" size="small" @click="addperm(1,'0')">新增权限</el-button>
        </span>
      </TopTool>
      <el-card>
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
        >
          <el-table-column
            prop="name"
            label="名称"
            width="180"
          />
          <el-table-column
            prop="code"
            label="标识"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="{row}">
              <el-button v-if="row.type===1" type="text" @click="addperm(2,row.id)">添加</el-button>
              <el-button type="text" @click="putPerm(row.id)">编辑</el-button>
              <el-button type="text" @click="delPerm(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :visible="showPerm" :title="title" @close="permCancel">
      <el-form ref="permform" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:70%" /></el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:70%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:70%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="permCancel">取消</el-button>
          <el-button type="primary" size="small" @click="permSure">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermList, addPerm, delPerm, getPermDetail, putPermDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '权限名称不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '权限标识不能为空' }]
      },
      showPerm: false,
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },

  created() {
    this.getPermList()
  },
  methods: {
    async getPermList() {
      this.loading = true
      this.list = tranListToTreeData(await getPermList(), '0')
      this.loading = false
    },
    addperm(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showPerm = true
    },
    async putPerm(id) {
      this.formData = await getPermDetail(id)
      this.showPerm = true
    },
    permCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permform.resetFields()
      this.showPerm = false
    },
    async permSure() {
      await this.$refs.permform.validate()
      // 判断是编辑还是添加
      if (this.formData.id) {
        await putPermDetail(this.formData)
      } else {
        await addPerm(this.formData)
      }
      // 重新获取数据
      this.getPermList()
      this.showPerm = false
      this.$message.success('操作成功')
    },
    // 删除
    async delPerm(id) {
      try {
        await this.$confirm('确定删除吗？')
        await delPerm(id)
        this.$message.success('删除权限成功')
        this.getPermList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>

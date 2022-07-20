<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="active">
          <el-tab-pane label="角色管理" name="usermanage">
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="addRole">新增角色</el-button>
            </el-row>
            <el-table
              border
              style="width: 100%"
              :data="formInfo"
            >
              <el-table-column
                label="序号"
                width="180"
                type="index"
              />
              <el-table-column
                prop="name"
                label="角色"
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
                  <el-button type="success" size="small" @click="assign(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(row.id)">编辑</el-button>
                  <el-button type="danger" size="small" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle">
              <el-pagination
                layout="prev, pager, next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="currentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="companyinfo">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
              style="margin-bottom:50px"
            />
            <el-form label-width="120px" class="demo-ruleForm">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" autocomplete="off" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" autocomplete="off" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled style="width:400px" type="textarea" :row="4" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog :title="title" :visible="showAddDialog" @close="btnCancle">
      <el-form ref="roleForm" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" label-width="120px" prop="name">
          <el-input v-model="roleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px">
          <el-input v-model="roleForm.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="btnCancle">取 消</el-button>
        <el-button type="primary" @click="btnSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配权限" :visible="showperm" @close="cancle">
      <el-tree
        ref="assigntree"
        :data="list"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="select"
        node-key="id"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancle">取消</el-button>
          <el-button type="primary" size="small" @click="sure">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleInfo, getCompanyInfo, delRoleInfo, getRoleDetailInfo, editRoleInfo, addRoleInfo, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      active: 'usermanage',
      page: {
        page: 1,
        pagesize: 8,
        total: 0
      },
      formInfo: [],
      formData: {},
      showAddDialog: false,
      roleForm: {},
      rules: {
        name: [{ required: true, trigger: 'blur', message: '角色名称不能为空' }]
      },
      list: [],
      defaultProps: {
        label: 'name'
      },
      showperm: false,
      select: [],
      roleId: ''
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    title() {
      return this.roleForm.id ? '编辑角色' : '添加角色'
    }
  },
  created() {
    this.getRoleInfo()
    this.getCompanyInfo()
  },
  methods: {
    // 根据分页信息获取角色列表
    async getRoleInfo() {
      const { rows, total } = await getRoleInfo(this.page)
      this.formInfo = rows
      this.page.total = total
    },
    // 点击分页数字，重新获取角色列表
    currentChange(page) {
      this.page.page = page
      this.getRoleInfo(this.page)
    },
    // 根据公司id获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 根据角色id删除角色
    async delRole(id) {
      console.log(id)
      try {
        await this.$confirm('确定删除该角色吗？')
        await delRoleInfo(id)
        await this.getRoleInfo()
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 根据id修改角色信息
    async editRole(id) {
      try {
        this.roleForm = await getRoleDetailInfo(id)
        // this.select = this.roleForm.permIds
        this.showAddDialog = true
      } catch (error) {
        console.log(error)
      }
    },
    // 点击确定按钮
    async btnSure() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await editRoleInfo({ ...this.roleForm, companyId: this.companyId })
        } else {
          await addRoleInfo(this.roleForm)
        }
        await this.getRoleInfo()
        this.showAddDialog = false
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击取消按钮
    btnCancle() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showAddDialog = false
    },
    // 点击新增按钮
    addRole() {
      this.showAddDialog = true
    },
    // 分配权限
    async assign(id) {
      this.roleId = id
      this.list = tranListToTreeData(await getPermList(), '0')
      const { permIds } = await getRoleDetailInfo(id)
      console.log(permIds)
      this.select = permIds
      this.showperm = true
    },
    cancle() {
      this.select = []
      this.showperm = false
    },
    async sure() {
      this.showperm = false
      await assignPerm({ permIds: this.$refs.assigntree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
    }
  }
}
</script>

<style>

</style>

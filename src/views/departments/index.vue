<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTool
          :tree-node="company"
          :isroot="true"
          @addDept="addDept"
        />

        <el-tree
          :data="departs"
          node-key="id"
          default-expand-all
        >
          <TreeTool
            slot-scope="{data}"
            :tree-node="data"
            @delDept="getdepartmentss"
            @addDept="addDept"
            @editDept="editDept"
          />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDeptDialog" :show-add-dialog.sync="showAddDialog" :tree-node="node" @sureAdd="getdepartmentss" />
  </div>
</template>

<script>
import TreeTool from '@/views/departments/components/TreeTool.vue'
import AddDept from '@/views/departments/components/AddDept.vue'
import { getdepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showAddDialog: false,
      node: {}
    }
  },
  created() {
    this.getdepartmentss()
  },
  methods: {
    // 获取部门数据
    async getdepartmentss() {
      const res = await getdepartments()
      console.log(res.depts)
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      // this.departs = res.depts
      this.departs = tranListToTreeData(res.depts, '')
      console.log(tranListToTreeData(res.depts, ''))
    },
    // 添加子部门
    addDept(node) {
      this.showAddDialog = true
      this.node = node
    },
    // 编辑子部门
    editDept(node) {
      this.showAddDialog = true
      this.node = node
      this.$refs.addDeptDialog.getdetaildeptinfo(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  100px;
  font-size:14px;
}
</style>

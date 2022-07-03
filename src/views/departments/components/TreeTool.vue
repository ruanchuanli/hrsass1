<template>
  <el-row :data="treeNode" class="custom-tree-node" type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col><span>{{ treeNode.manager }}</span></el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addDept">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isroot" command="editDept">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isroot" command="delDept">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deldepartments } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isroot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    operateDepts(type) {
      if (type === 'addDept') {
        console.log('add')
        this.$emit('addDept', this.treeNode)
      } else if (type === 'editDept') {
        console.log('edit')
        this.$emit('editDept', this.treeNode)
      } else if (type === 'delDept') {
        this.$confirm('确定删除该部门吗？').then(() => {
          // return一个promise对象，then执行成功后的操作
          return deldepartments(this.treeNode.id)
        }).then(() => {
          // 告诉父组件，让他重新获取新的数据
          this.$emit('delDept')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style scoped>

</style>

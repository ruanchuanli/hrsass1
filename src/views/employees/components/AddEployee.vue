<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancle">
    <!-- 表单 -->
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in hireType"
            :key="item.value"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getdepartments" />
        <el-tree v-if="showTree" v-loading="loading" :data="deptsData" :props="defaultProps" default-expand-all @node-click="chooseNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancle">取消</el-button>
          <el-button type="primary" size="small" @click="addSure">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import { getdepartments } from '@/api/departments'
import hireType from '@/api/constant/employees'
import { tranListToTreeData } from '@/utils'
export default {
  filters: {},
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hireType: hireType.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }]
      },
      deptsData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showTree: false,
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    // 获取所有部门
    async getdepartments() {
      this.loading = true
      const { depts } = await getdepartments()
      this.deptsData = tranListToTreeData(depts, '')
      this.showTree = true
      this.loading = false
    },
    async addSure() {
      try {
        await this.$refs.formData.validate()
        await addEmployee(this.formData)
        this.$emit('update:showDialog', false)
        this.$message.success('添加员工成功')
        this.$emit('addEmploy')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击取消
    btnCancle() {
      this.$emit('update:showDialog', false)
      this.$refs.formData.resetFields()
    },
    // 选择部门节点
    chooseNode(node) {
      // node为被点击的节点对象
      console.log(node)
      this.formData.departmentName = node.name
      this.showTree = false
    }
  }
}
</script>

<style scoped>

</style>

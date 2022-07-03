<template>
  <el-dialog :title="title" :visible="showAddDialog" @close="cancleAdd">
    <el-form ref="deptForm" :model="formData" :rules="rules">
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input
          v-model="formData.name"
          autocomplete="off"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" :label-width="formLabelWidth" prop="code">
        <el-input
          v-model="formData.code"
          autocomplete="off"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        :label-width="formLabelWidth"
        prop="manager"
      >
        <el-select v-model="formData.manager" placeholder="请选择负责人" @focus="getEmployeesSimple">
          <el-option v-for="(item, index) in people" :key="index" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        :label-width="formLabelWidth"
        prop="introduce"
      >
        <el-input
          v-model="formData.introduce"
          autocomplete="off"
          type="textarea"
          :row="3"
          placeholder="1-300个字符"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancleAdd">取 消</el-button>
      <el-button
        type="primary"
        @click="sureAdd"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getdepartments, adddepartments, getdetaildeptinfo, editdetaildeptinfo } from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'
export default {
  filters: {},
  components: {},
  props: {
    showAddDialog: {
      type: Boolean,
      required: true
    },
    treeNode: {
      type: Object,
      required: true
    }
  },
  data() {
    // 校验部门名称是否已经存在（在该节点下），得先获取最新的部门信息
    const isNameReapet = async(rule, value, callback) => {
      const { depts } = await getdepartments()
      let ishas = false
      if (this.formData.id) {
        // 如果是编辑,同级下名称不能一致，获取出来自己以外的同级数据
        ishas = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.formData.id).some(item1 => item1.name === value)
      } else {
        // 先获取该部门下的子节点，在判断子节点中是否有名字重复的
        ishas = depts.filter(item => item.pid === this.treeNode.id).some(item1 => item1.name === value)
      }
      ishas ? callback(new Error(`部门名${value}已经存在`)) : callback()
    }
    // 校验部门编码是否已经存在（在全部部门下）
    const isCodeReapet = async(rule, value, callback) => {
      const { depts } = await getdepartments()
      let hascode = false
      if (this.formData.id) {
        // 直接判断新增的编码是否与全部节点中的编码重复
        hascode = depts.filter(item1 => item1.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 直接判断新增的编码是否与全部节点中的编码重复
        hascode = depts.some(item => item.code === value && value)
      }
      hascode ? callback(new Error(`部门编码${value}已经存在`)) : callback()
    }
    return {
      dialogFormVisible: false,
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称长度为1-50个字符',
            trigger: 'blur'
          },
          { validator: isNameReapet, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码长度为1-50个字符',
            trigger: 'blur'
          },
          { validator: isCodeReapet, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门介绍长度为1-300个字符',
            trigger: 'blur'
          }
        ]
      },
      formLabelWidth: '120px',
      people: {}
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '添加子部门'
    }
  },
  watch: {},
  created() {},
  methods: {
    async getEmployeesSimple() {
      this.people = await getEmployeesSimple()
    },
    async getdetaildeptinfo(id) {
      this.formData = await getdetaildeptinfo(id)
    },
    sureAdd() {
      // 检查点击确定时，以上的检验是否通过
      this.$refs.deptForm.validate(async isok => {
        if (isok) {
          // 判断是编辑还是添加
          if (this.formData.id) {
            await editdetaildeptinfo(this.formData)
          } else {
            await adddepartments({
              ...this.formData, pid: this.treeNode.id
            })
          }
          // 父组件通过sync检测到更新的值
          this.$emit('update:showAddDialog', false)
          this.$message.success(`${this.formData.id ? '编辑部门成功' : '新增子部门成功'}`)
          this.$emit('sureAdd')
        }
      })
    },
    // 点击取消按钮关闭dialog，重置表单数据及校验结果
    cancleAdd() {
      this.formData = {
        name: '',
        code: '',
        introduce: '',
        manager: ''
      }
      this.$emit('update:showAddDialog', false)
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style scoped></style>

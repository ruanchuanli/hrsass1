<template>
  <el-dialog title="分配权限" :visible="showRole" @close="btnCancle">
    <el-checkbox-group v-model="rolesId">
      <el-checkbox v-for="item in rolesList" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row type="flex" justify="center">
      <el-button size="small" @click="btnCancle">取消</el-button>
      <el-button type="primary" size="small" @click="btnSure">确定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getUserDetailinfo } from '@/api/user'
import { getRoleInfo } from '@/api/setting'
import { assignRoles } from '@/api/employees'
export default {
  filters: {},
  components: {},
  props: {
    showRole: {
      type: Boolean,
      default: false
    },
    userId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      rolesId: [], // 存用户已拥有的角色
      rolesList: [], // 存所有角色
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRoleInfo()
  },
  methods: {
    // 根据用户id获取用户拥有的角色
    async getUserDetailinfo(id) {
      try {
        const { roleIds } = await getUserDetailinfo(id)
        if (roleIds) {
          this.rolesId = roleIds
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getRoleInfo() {
      try {
        const { rows } = await getRoleInfo({ page: 1, pagesize: 20 })
        console.log(rows)
        this.rolesList = rows
      } catch (error) {
        console.log(error)
      }
    },
    async btnSure() {
      this.$emit('update:showRole', false)
      await assignRoles({ roleIds: this.rolesId, id: this.userId })
      this.$message.success('用户分配角色成功')
    },
    btnCancle() {
      this.rolesId = []
      this.$emit('update:showRole', false)
    }
  }
}
</script>

<style scoped>

</style>

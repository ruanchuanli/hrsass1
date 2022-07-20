<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
import { addEmployees } from '@/api/employees'
import { formatDate } from '@/utils'
export default {
  filters: {},
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async success({ results }) {
      console.log(results)
      const formData = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.map(item => {
        const obj = {}
        Object.keys(formData).forEach(key => {
          if (formData[key] === 'timeOfEntry' || formData[key] === 'correctionTime') {
            obj[formData[key]] = new Date(formatDate(item[key], '/'))
            return
          }
          obj[formData[key]] = item[key]
        })
        arr.push(obj)
      })
      console.log(arr)
      await addEmployees(arr)
      this.$message.success('批量导入员工成功')
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>

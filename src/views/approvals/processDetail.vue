<template>
  <div>
    明细
  </div>
</template>

<script>
import { getProcessDetail } from '@/api/approvals'
export default {
  filters: {},
  components: {},
  data() {
    return {
      processId: this.$route.params.processId
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getProcessDetail()
  },
  methods: {
    async getProcessDetail() {
      const res = await getProcessDetail(this.processId)
      console.log(res)
    }
  }
}
</script>

<style scoped>

</style>

import TopTool from '@/components/PageTools/TopTool'
import UploadExcel from '@/components/UploadExcel'
import UploadImg from '@/components/UploadImg'
import Print from 'vue-print-nb'
export default {
  install(Vue) {
    Vue.component('TopTool', TopTool)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImg', UploadImg)
    Vue.use(Print)
  }
}

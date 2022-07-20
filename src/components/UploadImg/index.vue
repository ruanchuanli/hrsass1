<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :file-list="fileList"
      :limit="limit"
      :class="{addclass:isone}"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img width="100%" :src="imgurl" alt="">
    </el-dialog>
    <el-progress v-if="showProgress" :percentage="percent" style="width:180px" />
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID97pITN2QXNwEF2YnfFYaLp2yd06vShfM',
  SecretKey: 'ScV7SVHmzvXtymIXVCcmhLjqiKgmbASa'
})
export default {
  filters: {},
  components: {},
  props: {
    limit: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      imgurl: '',
      showDialog: false,
      fileList: [],
      percent: null,
      showProgress: false
    }
  },
  computed: {
    // 判断是否为一张
    isone() {
      return this.fileList.length === this.limit
    }
  },
  watch: {},
  created() {},
  methods: {
    // 删除功能
    onRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 图片预览，显示弹框
    onPreview(file) {
      this.imgurl = file.url
      this.showDialog = true
    },
    // 选择新的图片的操作
    onChange(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList.map(item => item)
    },
    // 上传前设置
    beforeUpload(file) {
      console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.warning('图片格式不正确')
        return false
      }
      const size = 5 * 1024 * 1024
      if (file.size > size) {
        this.$message.warning('图片大小不能大于')
        return false
      }
      return true
    },
    upload(file) {
      console.log(file)
      if (file.file) {
        this.showProgress = true
        cos.putObject({
          Bucket: 'ruanchuanli-111-1312806862', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: file.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',
          Body: file.file, // 上传文件对象
          onProgress: (progressData) => {
            console.log(JSON.stringify(progressData))
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            console.log(data)
            this.fileList = this.fileList.map(item => {
              if (item.uid === file.file.uid) {
                item = { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => { this.showProgress = false }, 500)
          }
        })
      }
    }
  }
}
</script>

<style>
.addclass .el-upload--picture-card{
  display: none!important;
}
</style>

<template>
  <div class="userEditDialog">
    <a-modal
      title="编辑用户"
      v-model:visible="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div>
        <div class="base-info">
          <label class="info-title">基本信息</label>
          <div class="content-box clearfix">
            <div class="pic-box">
              <a-upload
                class="avatar-uploader"
                :action="$api.api.upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="userInfo && userInfo.headSculpture" :src="userInfo.headSculpture" class="avatar">
                <i v-else class="a-icon-plus avatar-uploader-icon"></i>
              </a-upload>
            </div>
            <div class="info-box">
              <ul>
                <li>
                  <label>用户id：</label>
                  <span>{{userInfo.userId}}</span>
                </li>
                <li>
                  <label>用户名：</label>
                  <span class="name-block-content">
                    <EditText v-model:value="userInfo.username" @on-change="changeUsername"></EditText>
                  </span>
                </li>
                <li>
                  <span class="name-block clearfix">
                      <label>用户昵称：</label>
                      <span class="name-block-content"><EditText v-model:value="userInfo.userTickName"
                                                                 @on-change="changeUserTickName"></EditText></span>
                    </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="role-info">
          <label class="info-title">角色信息：</label>
          <div class="content-box clearfix">
            <label class="info-label">用户角色:</label>
            <span class="info-detail">
              <a-select v-model:value="userInfo.roleId" placeholder="请选择" style="width: 210px"  @change="changeRole">
                <a-select-option
                  v-for="item in roleList"
                  :key="item.id"
                  :title="item.name"
                  :value="item.id"
                  style="width: 210px">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="handleClose">取 消</a-button>
          <a-button type="primary" @click="saveFun">保 存</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>
<script>
import EditText from '@/components/modules/EditText'
import UploadUtil from '@/lib/upload'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { message } from 'ant-design-vue'
export default {
  name: 'set-project-dialog',
  props: {
    // 显示隐藏
    value: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true,
      default: () => {
        return {
          username: '',
          userId: '',
          userTickName: '',
          roleId: '',
          headSculpture: ''
        }
      }
    }
  },

  data () {
    return {
      dialogVisible: false,
      nameBlockStatus: 0,
      tickNameBlockStatus: 0,
      userInfo: this.data,
      imageUrl: '',
      roleList: [],
      $api
    }
  },
  computed: {},
  methods: {

    /**
       * 关闭窗口回调
       * @return {Void}
       */
    handleClose () {
      this.$emit('close')
    },
    /**
       * 保存窗口数据
       * @param {function} 回调函数
       * @return {Void}
       */
    saveFun () {
      const { userId, username, userTickName, roleId } = this.userInfo
      if (username === '') {
        message.warning('用户名不能为空！')
      } else if (userTickName === '') {
        message.warning('用户昵称不能为空！')
      } else {
        $axios.post($api.setting.saveUserInfo, { userInfo: JSON.stringify({ userId, username, userTickName, roleId }) }).then(res => {
          message.success('修改用户信息成功！')
          this.$emit('update')
        }).catch(e => {
          console.log(e)
        })
      }
    },
    /**
       * 用户名更改回调
       * @param {String} username 用户名
       * @return {Void}
       */
    changeUsername (username) {
      this.userInfo.username = username
    },
    /**
       * 用户昵称更改回调
       * @param {String} userTickName 用户名
       * @return {Void}
       */
    changeUserTickName (userTickName) {
      this.userInfo.userTickName = userTickName
    },
    /**
       * 用户角色更改回调
       * @param {String} roleId 用户角色id
       * @return {Void}
       */
    changeRole (roleId) {
      this.userInfo.roleId = roleId
    },
    /**
       * 加载角色下拉列表
       * @return {void}
       */
    getRoleListDic () {
      $axios.get($api.api.getRoleListDic, {}).then(res => {
        this.roleList = res.data
        console.log(this.roleList)
      }).catch(e => {
        console.log(e)
      })
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file)
      message.success('上传头像图片成功!')
      console.log(this.imageUrl)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        message.error('上传头像图片只能是 JPG 格式!')
        return false
      }
      if (!isLt2M) {
        message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      // let windowURL = window.URL || window.webkitURL
      // let imgUrl = URL.createObjectURL(file)
      // let config = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }
      console.log(file)
      const upload = new UploadUtil({
        file: file,
        filename: file.name,
        targetDir: 'headSculpture/'
      })
      upload.start().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // $axios.post($api.api.upload, param, config).then((res) => {
      //   this.handleAvatarSuccess(res, file);
      // })
      // $axios.get($api.api.getAliYunOssPolicy).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
      // return isJPG && isLt2M;
      // 阻止默认上传
      return false
    },
    // 覆盖默认的上传行为
    httprequest () {

    }
  },
  mounted () {
    this.getRoleListDic()
  },
  watch: {
    value (newVal) {
      this.dialogVisible = newVal
    },
    data (newVal) {
      console.log(newVal)
      this.userInfo = newVal
    }
  },
  components: {
    EditText
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .userEditDialog {
    .info-title {
      font-size: 16px;
      font-weight: bold;
    }
    .content-box {
      padding: 20px;
      display: flex;
      justify-content: flex-start;
      .pic-box {
        /*display: inline-block;*/
        width: 120px;
        height: 120px;
        border: 1px solid #ccc;
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
        }
        .avatar {
          width: 120px;
          height: 120px;
          display: block;
        }
      }
      .info-box {
        /*display: inline-block;*/
        flex: 1;
        /*width: 100%;*/
        padding: 0 20px;
        ul {
          width: 100%;
          li {
            width: 100%;
            height: 30px;
            line-height: 30px;
            display: flex;
            justify-content: flex-start;
            label {
              font-weight: bold;
            }
          ;
            .name-block {
              display: inline-block;
              /*width: 190px;*/
              .name-block-content {
                display: inline-block;
                /*width: 120px;*/
              }
            }
          }
        }
      }
      .info-label {
        font-size: 14px;
        font-weight: bold;
      }
      .info-detail {
        margin-left: 15px;
      }
    }
  }
</style>

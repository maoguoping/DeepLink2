<template>
  <a-modal
    title="编辑内容"
    v-model:visible="value"
    width="50%"
    :before-close="handleClose">
    <div class="doc" >
      <div class="read-box">
        <div class="doc-box">
          <a-form ref="form" :model="form" label-width="80px">
            <!--标题-->
            <a-form-item class="doc-title" label="标题：">
              <a-input id="titleInput" v-model:value="form.title" type="text" placeholder="请输入标题"></a-input>
            </a-form-item>
            <!--标签-->
            <a-form-item class="doc-tag" label="标签：">
              <el-tag
                :key="tag"
                v-for="tag in form.tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <a-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model:value="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </a-input>
              <a-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新标签</a-button>
            </a-form-item>
            <a-form-item class="doc-tag" label="操作：">
              <ul class="operation-bar clearfix">
                <li>统计</li>
              </ul>
            </a-form-item>
            <!--内容-->
            <div class="doc-content">
              <quill-editor ref="myTextEditor" :content="form.text" :options = "editorOption" ></quill-editor>
            </div>
          </a-form>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <span class="dialog-footer">
        <a-button @click="dialogVisible = false">取 消</a-button>
        <a-button type="primary" @click="onSubmit">确 定</a-button>
      </span>
    </template>
  </a-modal>
</template>
<script>
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
const manageCenterName = '管理中心'
export default {
  name: 'doc-edit',
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    data: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: '',
          title: '',
          path: '',
          tags: [],
          text: ''
        }
      }
    }
  },
  data () {
    return {
      form: {
        id: '',
        title: '',
        path: '',
        tags: [],
        text: ''
      },
      editorOption: {
        placeholder: '请输入文本',
        readOnly: false,
        theme: 'snow'
      }, // 编辑器选项
      displayFlag: false,
      submitFlag: false,
      pathStr: '',
      inputVisible: false,
      inputValue: ''
      //                docData: this.data
    }
  },
  methods: {
    handleClose (tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue) {
        console.log(this.form)
        this.form.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    initDisplay (data) {
      this.displayFlag = true
      this.form = {
        title: data.title || '',
        tags: data.tags || '',
        path: data.path || '',
        text: data.text || ''
      }
      if (this.data.text) {
        console.log(data)
        this.$refs.myTextEditor.setText(this.form.text)
      }
    },
    onSubmit () {
      //                //获取富文本编辑器文本
      const textObj = this.$refs.myTextEditor.quill.container.innerHTML
      console.log(textObj)
    },
    cancleEdit () {
      if (!this.submitFlag) {
        Modal.confirm({
          title:'提示',
          content: '编辑尚未提交，确定离开?',
          okText: '确定',
          cancelText: '取消',
          okType: 'warning',
          onOK() {
            // this.$router.push({name:"manageCenter",query:{path:this.docData.path,type:'doc'}});
            this.$emit('close')
            // this.displayFlag=false;
          }
        })
      }
    },
    pathLinkTo (name) {
      if (name === manageCenterName) {
        this.pathStr = ''
      } else {
        var index = this.pathStr.indexOf(name) + name.length
        this.pathStr = this.pathStr.substring(0, index)
      }
    }
  },
  mounted () {
  },
  updated () {
    if (!this.displayFlag && this.value) {
      this.initDisplay()
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (!newVal) {
        this.displayFlag = false
      }
    },
    data (newVal, oldVal) {
      this.initDisplay(newVal)
    }
  },
  components: {
    // 在#app元素内，注册组件
    'quill-editor': VueQuillEditor
  }
//        beforeRouteLeave(to, from, next) {
//            // 导航离开该组件的对应路由时调用
//            // 可以访问组件实例 `this`;
//            if(to.query.path!=this.docData.path){
//                next(false);
//                Modal.confirm('编辑尚未提交，确定离开?', '提示', {
//                    confirmButtonText: '确定',
//                    cancelButtonText: '取消',
//                    type: 'warning'
//                }).then(() => {
//                    // 选择确定
//                    next()
//                })
//            }else {
//                next();
//            }
//        }
}
</script>

<style lang="scss" scoped type="text/scss">
    .doc {
        height: 100%;
        margin: 0 auto;
        position: relative;
        width: 100%;
        .read-box{
            .doc-box {
                .doc-title {
                    box-sizing: border-box;
                    display: inline-block;
                    width: 100%;
                    text-align: left;
                    color: #393939;
                    font-size: 28px;
                    font-weight: bold;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    padding: 0px 50px;
                    /*input{*/
                    /*display: inline-block;*/
                    /*!*width: 90%;*!*/
                    /*height: 30px;*/
                    /*font-size: 20px;*/
                    /*}*/
                }
                .doc-tag {
                    padding: 0px 50px;
                    margin-bottom: 5px;
                    .el-tag + .el-tag {
                        margin-left: 10px;
                    }
                    .button-new-tag {
                        margin-left: 10px;
                        height: 32px;
                        line-height: 30px;
                        padding-top: 0;
                        padding-bottom: 0;
                    }
                    .input-new-tag {
                        width: 90px;
                        margin-left: 10px;
                        vertical-align: bottom;
                    }
                }
                .doc-content {
                    display: inline-block;
                    min-height: 200px;
                    padding: 0px 50px;
                    p {
                        font-size: 16px;
                        margin: 5px 0px;
                    }
                    .doc-img-box {
                        text-align: center;
                        .doc-img {
                            margin: 20px auto;
                        }
                    }
                    .quill-editor {
                          height: 260px;
                       .ql-container {
                          display: block;
                          height: 200px;
                       }
                    }
                    /*background-color: antiquewhite;*/
                }
                .submit-box {
                    margin: 15px auto;
                }
            }
        }
    }
</style>

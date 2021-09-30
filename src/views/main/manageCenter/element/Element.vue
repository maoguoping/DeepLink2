<template>
  <div class="element">
        <div class="title-box">
          <h1 class="title">{{listInfo.name}}</h1>
        </div>
        <div class="info-box">
          <div class="btn-box">
            <a class="edit-btn" @click="handleEditInfo">编辑</a>
          </div>
          <ul>
            <li>
              <label class="info-label">标签：</label><br>
              <div class="info-content">
                <span>
                <el-tag :key="tag" v-for="tag in dynamicTags">
                  {{tag}}
                </el-tag>
                <!--<a-input class="input-new-tag" v-if="inputVisible" v-model:value="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></a-input>-->
                <!--<a-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</a-button>-->
              </span>
              </div>
            </li>
            <li>
              <label class="info-label">描述：</label><br>
              <div class="info-content">
                 <p class="description-text">{{listInfo.description}}</p>
                 <!--<textarea class="description-text" v-model:value="listInfo.description" style="resize:none" ></textarea>-->
              </div>
            </li>
          </ul>
        </div>

        <div class="list-box">
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
        <SetElementInfoDialog
          v-model:value="showSetElementInfoDialog"
          :data="listInfo"
        ></SetElementInfoDialog>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { reactive, toRefs, computed } from 'vue'
import SetElementInfoDialog from '../components/dialog/setElementInfoDialog'
export default {
  name: 'Element',
  setup () {
    const store = useStore()
    const state = reactive({
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      showSetElementInfoDialog: false
    })
    const manageCenterInfo = computed(() => store.state.manageCenterStore.manageCenterInfo)
    const listInfo = computed(() => {
      return manageCenterInfo.value || {
        name: '',
        description: '',
        id: '',
        type: '',
        typeId: '',
        tag: '',
        path: '',
        pathId: '',
        parentId: '',
        parentName: '',
        parentType: '',
        parentTypeId: '',
        parentPath: '',
        parentPathId: '',
        modifyDate: '',
        children: []
      }
    })
    const handleEditInfo = () => {
      state.showSetElementInfoDialog = true
    }
    return {
      ...toRefs(state),
      manageCenterInfo,
      listInfo,
      handleEditInfo
    }
  },
  components: {
    SetElementInfoDialog
  }
}
</script>

<style lang="scss" scoped type="text/scss">
  .element {
    width: 100%;
      .title-box {
        display: block;
        line-height: 60px;
        width: 100%;
        padding-left: 20px;
      }
      .info-box {
        border: 1px solid #EEE;
        border-radius: 3px;
        padding: 20px;
        .btn-box{
          .edit-btn{
            font-size: 12px;
            float: right;
            cursor: pointer;
          }
        }
        .info-label{
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .info-content{
          margin-top: 10px;
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
          .description-text{
            width: 100%;
            font-size: 12px;
            text-indent: 2em;
          }
        }

      }
  }
</style>

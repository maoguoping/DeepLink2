<template>
  <div class="search-box">
    <div class="main">
      <transition name="slide">
        <slot name="main">
        </slot>
      </transition>
    </div>
    <div class="folder" v-show="showFolder">
      <div v-if="showMore" class="more-view">
        <p class="more-line" @click="switchMore">收起</p>
      </div>
      <div v-show="!showMore" class="less-view">
        <p class="less-line" @click="switchMore">更多搜索条件</p>
      </div>
    </div>

  </div>
</template>
<script>
import { reactive, toRefs, getCurrentInstance, onMounted, nextTick } from 'vue'
export default {
  name: 'SearchBox',
  setup () {
    const { ctx } = getCurrentInstance()
    const state = reactive({
      showMore: false,
      showFolder: false
    })
    const init = () => {
      const items = ctx.$el.querySelectorAll('.search-box-item')
      const num = items.length
      const boxWidth = ctx.$el.querySelector('.main').offsetWidth
      const itemWidth = ctx.$el.querySelector('.search-box-item').offsetWidth
      const maxNum = (itemWidth === 0) ? 0 : Math.floor(boxWidth / itemWidth) + 1
      if (num <= maxNum) {
        state.showFolder = false
      } else {
        state.showFolder = true
      }
      if (state.showMore || num <= maxNum) {
        for (let i = maxNum - 1; i < num - 1; i++) {
          items[i].style.display = 'inline-block'
        }
      } else {
        for (let i = maxNum - 1; i < num - 1; i++) {
          items[i].style.display = 'none'
        }
      }
    }
    const switchMore = () => {
      state.showMore = !state.showMore
      init()
    }
    onMounted(() => {
      nextTick(() => {
        init()
      })
    })
    return {
      ...toRefs(state),
      init,
      switchMore
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box{
  display: inline-block;
  box-sizing: border-box;
  margin: 20px 0;
  padding:20px 20px 5px 20px;
  width: 100%;
  border: 1px solid #eee;
  background-color: #fff;
  .main{
    .slide-enter-active,.slide-leave-active{
      transition: opacity .5s;
    }
  }
  .folder{
    margin-top: 15px;
    .less-view{
      height: 30px;
      line-height: 30px;
    }
    .more-line,.less-line{
      text-align: right;
      font-size: 12px;
      cursor:pointer;
      color: #8cc5ff;
    }
    .more-line {
      height: 30px;
      line-height: 30px;
    }
  }

}
</style>

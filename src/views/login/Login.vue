<template>
  <div class="login">
    <div class="bg-pic">
      <transition :duration="{ enter: 300, leave: 300 }" name="login-box">
        <component :is="box" @change-box="handlerChange"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import LoginBox from './LoginBox'
import RegisterBox from './RegisterBox'
import { shallowRef } from 'vue'
export default {
  name: 'login',
  setup () {
    const box = shallowRef(LoginBox)
    /**
     * 切换组件回调
     * @param name  {String} 组件名称
     */
    const handlerChange = (name) => {
      console.log('handlerChange', name)
      const components = {
        login: LoginBox,
        register: RegisterBox
      }
      box.value = components[name]
    }
    return {
      box,
      handlerChange
    }
  },
  components: {
    LoginBox,
    RegisterBox
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  .bg-pic{
    background-color: #101f3c;
    background:url(../../assets/img/login_bg.jpg)  no-repeat center center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items:Center;
    .login-box,.register-box{
      z-index: 1;
      background: hsla(0,0%,100%,.8);
    }
    .login-box-enter-active,.login-box-leave-active{
      transition: all 0.3s ease
    }
    .login-box-enter,.login-box-leave-active{
      opacity: 0
    }
  }
}
</style>

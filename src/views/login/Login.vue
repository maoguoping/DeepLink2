<template>
  <div class="login">
    <div class="bg-pic">
      <transition :duration="{ enter: 300, leave: 300 }" name="login-box">
        <component :is="box" @change="handlerChange"></component>
      </transition>
    </div>
  </div>
</template>
<script>
import LoginBox from "./LoginBox";
import RegisterBox from "./RegisterBox";
export default {
  name: "login",
  setup(props) {
	let box = LoginBox
    const handlerChange = (name) => {
      let components = {
        login: LoginBox,
        register: RegisterBox,
      };
      box = null;
      setTimeout(() => {
        box = components[name];
      }, 300);
    };
    return {
	  box,
	  handlerChange
    };
  },
  components: {
    LoginBox,
    RegisterBox,
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  .bg-pic {
    background-color: #101f3c;
    background: url(../../assets/img/login_bg.jpg) no-repeat center center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: Center;
    .login-box,
    .register-box {
      z-index: 1;
      background: hsla(0, 0%, 100%, 0.8);
    }
    .login-box-enter-active,
    .login-box-leave-active {
      transition: all 0.3s ease;
    }
    .login-box-enter,
    .login-box-leave-active {
      opacity: 0;
    }
  }
}
</style>

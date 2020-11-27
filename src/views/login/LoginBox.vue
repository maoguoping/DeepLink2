<template>
  <div class="login-box">
    <div class="logo-box">
      <div class="logo-box-content clearfix">
        <img src="@/assets/img/DeepLink.png" alt="">
        <span>DeepLink</span>
      </div>
    </div>
    <div class="title-box">
      登录DeepLink,创造你的世界
    </div>
    <a-form ref="loginForm" :model="form" :laba-col="labelCol" :wrapper-col="wrapperCol"  :rules="rules" @submit.prevent>
      <a-form-item label="用户名" name="account">
        <a-input v-model:value="form.account"></a-input>
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="form.password" type="password"></a-input-password>
      </a-form-item>
    </a-form>
    <div class="btn-box">
      <a-button type="primary" style="width:100%" @click="login" :disabled="isDisable">登录</a-button>
      <ul class="btn-list clearfix">
        <li>忘记密码</li>
        <li @click="register">注册</li>
      </ul>
      <p class="info-box">
        <span>@2018 gpmao</span> <a href="github.com/maoguoping">github.com/maoguoping</a>
      </p>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import $axios from '@/lib/axios'
import $api from '@/lib/interface'
import { message } from 'ant-design-vue'
import { reactive, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'loginBox',
  setup (props, { emit }) {
    const internalInstance = getCurrentInstance()
    const store = useStore()
    const router = useRouter()
    const validateAccount = async (rule, value) => {
      console.log(value)
      if (value === '') {
        return Promise.reject(new Error('请输入账户'))
      } else {
        return Promise.resolve()
      }
    }
    const validatePassword = async (rule, value, callback) => {
      if (value === '') {
        return Promise.reject(new Error('请输入密码'))
      } else {
        return Promise.resolve()
      }
    }
    const form = reactive({
      account: '',
      password: ''
    })
    const labelCol = { span: 4 }
    const wrapperCol = { span: 19 }
    const isDisable = false
    const rules = {
      account: [
        { validator: validateAccount, trigger: 'blur' }
      ],
      password: [
        { validator: validatePassword, trigger: 'blur' }
      ]
    }
    /**
     * 登录
     */
    const login = async () => {
      console.log(internalInstance)
      try {
        const valid = await internalInstance.refs.loginForm.validate()
        if (valid) {
          const res = await $axios.post($api.users.login, {
            username: form.account,
            password: md5(form.password)
          })
          // 将用户信息放入localStorage
          localStorage.setItem('username', res.username)
          localStorage.setItem('token', res.token)
          store.commit('userStatus', { username: res.username })
          store.commit('userToken', res.token)
          // 输出状态
          router.push({
            path: '/'
          })
        }
      } catch (err) {
        message.error(err.message || '错误')
      }
    }
    /**
     * 切换到注册
     */
    const register = () => {
      emit('change-box', 'register')
    }
    return {
      labelCol,
      wrapperCol,
      form,
      isDisable,
      rules,
      login,
      register
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box{
  box-sizing: border-box;
  width: 432px;
  height: 350px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  .logo-box{
    height: 70px;
    text-align: center;
    margin-bottom: 5px;
    .logo-box-content{
      height: inherit;
      display: flex;
      justify-content: center;
      img{
        height: inherit;
      }
      span{
        display: inline-block;
        height: 70px;
        line-height: 70px;
        margin-left: 20px;
        font-weight: bold;
        font-size: 30px;
      }
    }

  }
  .title-box{
    text-align: center;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
  }
  .btn-box{
    margin-top: 10px;
    .btn-list{
      margin: 10px 0;
      display: flex;
      justify-content: center;
      li{
        font-size: 12px;
        width: 50%;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .info-box{
    font-size: 10px;
    text-align: center;
    color: #8c939d;
    a{
      color: #8c939d;
    }
  }
}
</style>

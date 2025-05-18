<template>
  <div>
    <div class="top-bar">
      <router-link class="back-home" to="/">返回首页</router-link>
    </div>
    <div class="login-container">
      <div class="logo">哔哩哔哩</div>
      <div class="login-title">账号登录</div>
      <form @submit.prevent="onLogin">
        <div class="input-group">
          <label class="input-label" for="user">账号</label>
          <input class="input-box" type="text" id="user" v-model="user" placeholder="请输入手机号/邮箱/用户名" required>
        </div>
        <div class="input-group">
          <label class="input-label" for="password">密码</label>
          <input class="input-box" type="password" id="password" v-model="password" placeholder="请输入密码" required>
        </div>
        <div class="btn-group">
          <button class="login-btn" type="submit">登录</button>
          <button class="register-btn" type="button" @click="goRegister">没有账号？立即注册</button>
        </div>
      </form>
      <div class="tips">未注册的手机号/邮箱将自动创建新账号</div>
    </div>
    <div v-if="alertMsg" class="custom-alert">{{ alertMsg }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref('')
const password = ref('')
const router = useRouter()
const alertMsg = ref('')
let alertTimer = null

function showAlert(msg, cb) {
  alertMsg.value = msg
  clearTimeout(alertTimer)
  alertTimer = setTimeout(() => {
    alertMsg.value = ''
    if (cb) cb()
  }, 2000)
}

function onLogin() {
  // 这里只做演示，实际应调用后端API
  if (user.value && password.value) {
    localStorage.setItem('bili_user', user.value)
    showAlert('登录成功！', () => router.push('/'))
  } else {
    showAlert('请输入账号和密码')
  }
}
function goRegister() {
  router.push('/register')
}
</script>

<style scoped>
.top-bar {
  width: 100%;
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px #e3e6ea;
  border-bottom: 3px solid #fb7299;
  margin-bottom: 32px;
}
.back-home {
  margin-left: 32px;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(90deg, #00a1d6 0%, #23b4e7 100%);
  border: none;
  border-radius: 8px;
  padding: 0 28px;
  height: 36px;
  line-height: 36px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  box-shadow: 0 2px 8px #e3e6ea;
  display: inline-block;
  outline: none;
  border: 0;
}
.back-home:hover, .back-home:focus {
  background: linear-gradient(90deg, #0090b3 0%, #1a9edb 100%);
  color: #fff;
}
.login-container {
  width: 400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0,161,214,0.10);
  padding: 48px 40px 36px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo {
  font-size: 36px;
  font-weight: bold;
  color: #fb7299;
  margin-bottom: 12px;
  letter-spacing: 2px;
}
.login-title {
  font-size: 22px;
  color: #222;
  margin-bottom: 32px;
  font-weight: 500;
}
.input-group {
  width: 100%;
  margin-bottom: 24px;
}
.input-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 6px;
  display: block;
}
.input-box {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e3e6ea;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border 0.2s;
  background: #fafbfc;
  margin-bottom: 2px;
}
.input-box:focus {
  border: 1.5px solid #00a1d6;
}
.btn-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
}
.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #00a1d6 0%, #23b4e7 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #e3e6ea;
  transition: background 0.2s;
  margin-bottom: 0;
}
.login-btn:hover {
  background: linear-gradient(90deg, #0090b3 0%, #1a9edb 100%);
}
.register-btn {
  width: 100%;
  height: 48px;
  background: #fff;
  color: #00a1d6;
  border: 1.5px solid #e3e6ea;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: border 0.2s, color 0.2s;
}
.register-btn:hover {
  border: 1.5px solid #00a1d6;
  color: #0090b3;
}
.tips {
  margin-top: 18px;
  font-size: 13px;
  color: #888;
  text-align: center;
}
@media (max-width: 500px) {
  .login-container { width: 98vw; padding: 24px 6vw; }
  .top-bar { height: auto; }
  .back-home { margin-left: 10px; padding: 0 10vw; }
}
.custom-alert {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: #fffbe6;
  color: #d46b08;
  border: 1.5px solid #ffe58f;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 12px #ffe58f99;
  z-index: 9999;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style> 
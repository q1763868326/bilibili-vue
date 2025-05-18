<template>
  <div>
    <div class="top-bar">
      <router-link class="back-home" to="/">返回首页</router-link>
    </div>
    <div class="register-container">
      <div class="logo">哔哩哔哩</div>
      <div class="register-title">账号注册</div>
      <form @submit.prevent="onRegister">
        <div class="input-group">
          <label class="input-label" for="user">账号</label>
          <input class="input-box" type="text" id="user" v-model="user" placeholder="请输入手机号/邮箱/用户名" required>
        </div>
        <div class="input-group">
          <label class="input-label" for="password">密码</label>
          <input class="input-box" type="password" id="password" v-model="password" placeholder="请输入密码" required>
        </div>
        <div class="input-group">
          <label class="input-label" for="confirm">确认密码</label>
          <input class="input-box" type="password" id="confirm" v-model="confirm" placeholder="请再次输入密码" required>
        </div>
        <div class="btn-group">
          <button class="register-btn" type="submit">注册</button>
        </div>
      </form>
      <div class="tips">注册即代表你同意用户协议和隐私政策</div>
    </div>
    <div v-if="alertMsg" class="custom-alert">{{ alertMsg }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref('')
const password = ref('')
const confirm = ref('')
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

function onRegister() {
  if (!user.value || !password.value || !confirm.value) {
    showAlert('请填写完整信息')
    return
  }
  if (password.value !== confirm.value) {
    showAlert('两次输入的密码不一致')
    return
  }
  // 模拟注册成功并自动登录
  localStorage.setItem('bili_user', user.value)
  showAlert('注册成功，已自动登录！', () => router.push('/'))
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
.register-container {
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
.register-title {
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
.register-btn {
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
.register-btn:hover {
  background: linear-gradient(90deg, #0090b3 0%, #1a9edb 100%);
}
.tips {
  margin-top: 18px;
  font-size: 13px;
  color: #888;
  text-align: center;
}
@media (max-width: 500px) {
  .register-container { width: 98vw; padding: 24px 6vw; }
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
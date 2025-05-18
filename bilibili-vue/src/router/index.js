import { createRouter, createWebHistory } from 'vue-router'
import BilibiliHome from '../components/BilibiliHome.vue'
import BilibiliLogin from '../components/BilibiliLogin.vue'
import BilibiliRegister from '../components/BilibiliRegister.vue'

const routes = [
  { path: '/', component: BilibiliHome },
  { path: '/login', component: BilibiliLogin },
  { path: '/register', component: BilibiliRegister }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
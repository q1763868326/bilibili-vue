<template>
  <div>
    <header class="bili-header">
      <span>哔哩哔哩直播推荐</span>
      <div>
        <template v-if="user">
          <span class="user-nick">{{ user }}</span>
          <button class="logout-btn" @click="logout">退出</button>
        </template>
        <router-link v-else class="login-link" to="/login">登录</router-link>
      </div>
    </header>
    <div class="loadmore-bar">
      <span class="loadmore-tip">{{ loadMoreTip }}</span>
    </div>
    <div class="container">
      <a
        v-for="item in videos"
        :key="item.link + Math.random()"
        class="card"
        :href="item.link"
        target="_blank"
      >
        <img
          class="cover"
          :src="`/api/proxy-img?url=${encodeURIComponent(item.cover)}`"
          alt="cover"
          @error="e => (e.target.src = defaultCover)"
        />
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="meta">
            <span class="up">主播: {{ item.up || '未知' }}</span>
            <span class="play">{{ item.play || '' }}</span>
          </div>
        </div>
      </a>
    </div>
    <button v-show="showBackTop" class="back-top-btn" @click="scrollToTop" aria-label="返回顶部">
      <svg class="rocket-icon" viewBox="0 0 48 48" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M24 4C27 10 36 22 24 44C12 22 21 10 24 4Z" fill="#00a1d6" stroke="#fff" stroke-width="2"/>
          <ellipse cx="24" cy="16" rx="4" ry="5" fill="#fff"/>
          <rect x="22" y="28" width="4" height="10" rx="2" fill="#fb7299"/>
          <path d="M24 38L21 44H27L24 38Z" fill="#ffb3c6"/>
        </g>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const videos = ref([])
const defaultCover = 'https://static.hdslb.com/images/akari.jpg'
const user = ref(localStorage.getItem('bili_user') || '')
const loading = ref(false)
const refreshTip = ref('')
const loadMoreTip = ref('')
const showBackTop = ref(false)

async function fetchVideos() {
  loading.value = true
  refreshTip.value = '正在刷新...'
  try {
    const res = await fetch('/api/bili-rcmd')
    const data = await res.json()
    if (data.data && Array.isArray(data.data.recommend_room_list)) {
      videos.value = data.data.recommend_room_list.map(live => ({
        title: live.title,
        cover: live.cover?.startsWith('http') ? live.cover : ('https:' + live.cover),
        up: live.uname,
        play: live.online + ' 人气',
        link: `https://live.bilibili.com/${live.roomid}`
      }))
    } else {
      videos.value = []
    }
    refreshTip.value = '刷新成功'
    setTimeout(() => { refreshTip.value = '' }, 800)
  } catch (e) {
    videos.value = []
    refreshTip.value = '刷新失败'
    setTimeout(() => { refreshTip.value = '' }, 1200)
  }
  loading.value = false
}

async function loadMoreVideos() {
  if (loading.value) return
  loading.value = true
  loadMoreTip.value = '加载中...'
  try {
    const res = await fetch('/api/bili-rcmd')
    const data = await res.json()
    if (data.data && Array.isArray(data.data.recommend_room_list)) {
      const newList = data.data.recommend_room_list.map(live => ({
        title: live.title,
        cover: live.cover?.startsWith('http') ? live.cover : ('https:' + live.cover),
        up: live.uname,
        play: live.online + ' 人气',
        link: `https://live.bilibili.com/${live.roomid}`
      }))
      videos.value = videos.value.concat(newList)
      loadMoreTip.value = '加载成功'
      setTimeout(() => { loadMoreTip.value = '' }, 800)
    } else {
      loadMoreTip.value = '没有更多了'
      setTimeout(() => { loadMoreTip.value = '' }, 1200)
    }
  } catch (e) {
    loadMoreTip.value = '加载失败'
    setTimeout(() => { loadMoreTip.value = '' }, 1200)
  }
  loading.value = false
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  if (loading.value) return
  const scrollY = window.scrollY || window.pageYOffset
  const viewportHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight
  showBackTop.value = scrollY > 300
  if (scrollY + viewportHeight >= fullHeight - 80) {
    loadMoreVideos()
  }
}

onMounted(() => {
  document.title = '哔哩哔哩直播推荐'
  fetchVideos()
  loadMoreVideos()
  window.addEventListener('scroll', handleScroll)

  // 移动端下拉刷新
  let startY = 0
  let pulling = false
  window.addEventListener('touchstart', e => {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY
      pulling = true
    }
  })
  window.addEventListener('touchmove', e => {
    if (!pulling) return
    const deltaY = e.touches[0].clientY - startY
    if (deltaY > 80 && !loading.value) {
      pulling = false
      fetchVideos()
    }
  })
  window.addEventListener('touchend', () => {
    pulling = false
  })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function logout() {
  localStorage.removeItem('bili_user')
  user.value = ''
  location.reload()
}
</script>

<style scoped>
.bili-header {
  background: #fff;
  padding: 0 0 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  color: #fb7299;
  letter-spacing: 2px;
  box-shadow: 0 2px 8px #e3e6ea;
  border-bottom: 3px solid #fb7299;
  justify-content: space-between;
}
.bili-header > div {
  display: flex;
  align-items: center;
}
.login-link {
  margin-right: 40px;
  font-size: 17px;
  color: #fff;
  background: linear-gradient(90deg, #00a1d6 0%, #23b4e7 100%);
  border: none;
  border-radius: 8px;
  padding: 0 36px;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  box-shadow: 0 2px 8px #e3e6ea;
  display: inline-block;
  outline: none;
  border: 0;
}
.login-link:hover, .login-link:focus {
  background: linear-gradient(90deg, #0090b3 0%, #1a9edb 100%);
  color: #fff;
}
.user-nick {
  font-size: 17px;
  color: #00a1d6;
  font-weight: bold;
  margin-right: 18px;
}
.logout-btn {
  font-size: 15px;
  color: #fff;
  background: linear-gradient(90deg, #fb7299 0%, #ffb3c6 100%);
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  height: 36px;
  line-height: 36px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 24px;
  transition: background 0.2s;
  box-shadow: 0 2px 8px #e3e6ea;
}
.logout-btn:hover {
  background: linear-gradient(90deg, #e06292 0%, #fb7299 100%);
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 40px auto 0 auto;
  max-width: 1400px;
}
.card {
  width: 240px;
  margin: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  text-decoration: none;
  color: #222;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s, border 0.2s;
  border: 1.5px solid #e3e6ea;
  position: relative;
}
.card:hover {
  box-shadow: 0 8px 24px 0 rgba(0,161,214,0.15);
  border: 2px solid #00a1d6;
  transform: translateY(-4px) scale(1.03);
  z-index: 2;
}
.cover {
  width: 100%;
  height: 140px;
  object-fit: cover;
  background: #e3e6ea;
  display: block;
}
.info {
  padding: 14px 16px 10px 16px;
}
.title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.meta {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}
.meta .up {
  color: #00a1d6;
  font-weight: 500;
  margin-right: 12px;
}
.meta .play {
  color: #fb7299;
  font-weight: 500;
}
@media (max-width: 900px) {
  .container { max-width: 100%; justify-content: center; }
  .card { width: 95vw; max-width: 340px; }
  .bili-header { flex-direction: column; height: auto; padding: 0 0 0 0; }
  .login-link { margin: 12px 0 0 0; }
}
.loadmore-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0 0 0;
  min-height: 32px;
}
.loadmore-tip {
  color: #00a1d6;
  font-size: 14px;
  min-width: 60px;
}
.back-top-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 100;
  background: linear-gradient(90deg, #00a1d6 0%, #23b4e7 100%);
  border: none;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.12);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  padding: 0;
}
.back-top-btn:hover {
  background: linear-gradient(90deg, #0090b3 0%, #1a9edb 100%);
  box-shadow: 0 4px 24px 0 rgba(0,161,214,0.18);
}
.rocket-icon {
  display: block;
}
</style> 
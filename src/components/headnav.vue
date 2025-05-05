<template>
    <nav class="navbar">
        <div>
            <router-link to="/" class="logo">
                <img src="/树.png" alt="Vite logo" />
                <span class="logo">The Spiritual<br /> Wisdom Language</span>
            </router-link>
        </div>
        <div class="right">
            <ul class="nav-links">
                <li>
                    <router-link v-if="!isLoggedIn" to="/login">
                        <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                        </svg>
                        登录/Login
                    </router-link>
                    <a v-else href="#" @click.prevent="handleLogout">
                        <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                        </svg>
                        退出登录
                    </a>
                </li>
                <li>
                    <router-link to="/history">
                        <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                        </svg>
                        历史测验
                    </router-link>
                </li>
                <li>
                    <router-link to="/myswl">
                        <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
                        </svg>
                        我的SWL
                    </router-link>
                </li>
                <li>
                    <router-link to="/about">
                        <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
                        </svg>
                        关于SWL
                    </router-link>
                </li>
            </ul>
            <button class="feature-button">体验所有功能</button>
            <div class="search-container">
                <div class="search-input" v-if="isSearchActive">
                    <div class="search-icon-inner">
                        <svg t="1734317543803" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2314" width="30" height="30">
                            <path
                                d="M830.486464 796.124515 672.790943 638.42797c44.959904-52.799318 72.109099-121.232412 72.109099-196.016087 0-167.084182-135.448007-302.533214-302.53219-302.533214s-302.533214 135.449031-302.533214 302.533214 135.449031 302.53219 302.533214 302.53219c74.782651 0 143.215745-27.149196 196.017111-72.109099L796.101988 830.531518c9.499249 9.499249 24.885227 9.499249 34.384476 0S839.986737 805.623764 830.486464 796.124515zM442.366829 698.401131c-141.380814 0-255.989248-114.631985-255.989248-255.989248 0-141.403341 114.608434-255.989248 255.989248-255.989248 141.37979 0 255.989248 114.585907 255.989248 255.989248C698.356077 583.769146 583.747643 698.401131 442.366829 698.401131z"
                                fill="#889297" p-id="2315"></path>
                        </svg>
                    </div>
                    <input type="text" placeholder="Search you want" v-model="searchText">
                    <span class="close-search" @click="toggleSearch">×</span>
                </div>
                <div class="search-icon" @click="toggleSearch" v-else>
                    <svg t="1734317543803" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2314" width="30" height="30">
                        <path
                            d="M830.486464 796.124515 672.790943 638.42797c44.959904-52.799318 72.109099-121.232412 72.109099-196.016087 0-167.084182-135.448007-302.533214-302.53219-302.533214s-302.533214 135.449031-302.533214 302.533214 135.449031 302.53219 302.533214 302.53219c74.782651 0 143.215745-27.149196 196.017111-72.109099L796.101988 830.531518c9.499249 9.499249 24.885227 9.499249 34.384476 0S839.986737 805.623764 830.486464 796.124515zM442.366829 698.401131c-141.380814 0-255.989248-114.631985-255.989248-255.989248 0-141.403341 114.608434-255.989248 255.989248-255.989248 141.37979 0 255.989248 114.585907 255.989248 255.989248C698.356077 583.769146 583.747643 698.401131 442.366829 698.401131z"
                            fill="#889297" p-id="2315"></path>
                    </svg>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSearchActive = ref(false)
const searchText = ref('')
const isLoggedIn = ref(false)

// 更新登录状态的函数
const updateLoginStatus = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
}

// 组件挂载时添加事件监听
onMounted(() => {
  // 初始化登录状态
  updateLoginStatus()
  
  // 监听 storage 事件
  window.addEventListener('storage', updateLoginStatus)
  
  // 添加自定义事件监听
  window.addEventListener('login-status-changed', updateLoginStatus)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('storage', updateLoginStatus)
  window.removeEventListener('login-status-changed', updateLoginStatus)
})

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  isLoggedIn.value = false
  router.push('/login')
}

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value
  if (!isSearchActive.value) {
    searchText.value = ''
  }
}
</script>

<style scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #fff;
}

.logo {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.logo img {
    height: 7em;
    width: 7em;
    border-radius: 1000px;
}

.logo span {
    margin-left: 15px;
    width: 200px;
    height: 95px;
    font-size: 20px;
    line-height: 37.65px;
    opacity: 1;
    font-weight: 400;
    letter-spacing: 0px;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 50px;
    justify-content: space-between;
    margin-right: 20px;
}

.nav-links li a,
.nav-links li router-link {
    width: auto;
    font-size: 20px;
    white-space: nowrap;
    left: 940px;
    top: 100px;
    height: 66px;
    opacity: 1;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 0px;
    color: rgba(0, 0, 0, 1);
    text-align: left;
    vertical-align: middle;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.router-link-active {
    color: rgba(219, 107, 107, 1) !important;
}

.router-link-active .nav-icon {
    color: rgba(219, 107, 107, 1) !important;
    opacity: 1;
}

.right {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
}

.feature-button {
    border: none;
    left: 1498px;
    top: 75px;
    width: 150px;
    height: 60px;
    opacity: 1;
    border-radius: 10px;
    background: rgba(219, 107, 107, 1);
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 37.65px;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    vertical-align: middle;
}

.feature-button:hover {
    left: 1498px;
    top: 75px;
    width: 150px;
    height: 60px;
    opacity: 1;
    border-radius: 10px;
    background: rgba(161, 51, 51, 1);
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 37.65px;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    vertical-align: middle;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #000;
    border-radius: 10px;
    padding: 0;
    height: 60px;
    width: 250px;
}

.search-icon-inner {
    display: flex;
    align-items: center;
    padding: 0 10px;
}

.search-input input {
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    font-size: 16px;
    padding: 0 10px;
}

.close-search {
    cursor: pointer;
    font-size: 24px;
    color: #889297;
    padding: 0 10px;
}

.close-search:hover {
    color: #000;
}

.search-icon {
    cursor: pointer;
    border: 1px solid #000;
    border-radius: 10px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
}

.nav-icon {
    vertical-align: middle;
    margin-right: 8px;
    opacity: 0.7;
}
</style>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 左侧欢迎区域 -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="logo-container">
            <img src="/树.png" alt="Logo" class="logo">
          </div>
          <h1>WELCOME~</h1>
          <p class="slogan">探索心灵的智慧之语</p>
          <div class="features">
            <div class="feature-item">
              <span class="feature-icon">🌟</span>
              <span>心理测评</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💭</span>
              <span>心灵智语</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📚</span>
              <span>在线咨询</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-section">
        <div class="login-header">
          <h2>登录</h2>
          <p>欢迎回来，请登录您的账号</p>
        </div>
        <div class="login-form">
          <div class="form-item">
            <input 
              type="text" 
              v-model="username" 
              :class="{ 'has-value': username }"
              placeholder="用户名"
              required
            >
            <span class="input-icon">👤</span>
          </div>
          
          <div class="form-item">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              :class="{ 'has-value': password }"
              placeholder="密码"
              required
            >
            <span class="input-icon">🔒</span>
            <span class="password-toggle" @click="togglePassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </span>
          </div>
          
          <div class="remember-forgot">
            <label class="remember-label">
              <input type="checkbox" v-model="remember" class="hidden-checkbox">
              <span class="checkmark"></span>
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          
          <div class="login-actions">
            <button class="login-btn" @click="handleLogin" :disabled="!username || !password">
              <span>登录</span>
              <span class="btn-icon">→</span>
            </button>
            <div class="register-link">
              还没有账号？<router-link to="/register">立即注册</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const message = inject('message')
const username = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    if (!username.value || !password.value) {
      message.show('请输入用户名和密码', 'error')
      return
    }

    const response = await axios.post('http://localhost:9999/api/users/login', {
      username: username.value,
      password: password.value
    })

    if (response.data.code === 200) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username.value)
      localStorage.setItem('userId', response.data.data.id)
      
      if (remember.value) {
        localStorage.setItem('rememberedUsername', username.value)
      }
      
      window.dispatchEvent(new Event('login-status-changed'))
      
      router.push('/')
      
      setTimeout(() => {
        message.show('登录成功', 'success', 2000)
      }, 100)

      console.log('登录用户信息:', response.data)
    } else {
      message.show(response.data.message || '登录失败', 'error')
    }
  } catch (error) {
    console.error('登录失败:', error)
    message.show(error.response?.data?.message || '登录失败，请重试', 'error')
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 74vh;
  background: linear-gradient(135deg, #fce4ec 0%, #e3f2fd 100%);
}

.login-box {
  display: flex;
  width: 900px;
  height: 550px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(255, 107, 107, 0.1);
}

.welcome-section {
  flex: 1;
  background: linear-gradient(135deg, rgba(252, 228, 236, 0.9) 0%, rgba(227, 242, 253, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  width: 300%;
  height: 200%;
  background: url('/树.png') center/contain no-repeat;
  opacity: 0.1;
  animation: rotate 20s linear infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.welcome-section h1,
.welcome-section p {
  position: relative;
  z-index: 2;
}

.welcome-section h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 20px;
}

.welcome-section p {
  font-size: 1.5em;
  color: #666;
}

.login-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 3;
  background: rgba(255, 255, 255, 0.95);
  margin-right: 40px;
}

.login-section h2 {
  font-size: 2em;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  position: relative;
  width: calc(100% + 40px);
}

.form-item input {
  width: 80%;
  padding: 12px 20px 12px 45px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
  background: transparent;
}

.form-item input:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.form-item input::placeholder {
  color: #999;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  user-select: none;
  z-index: 1;
}

.login-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover {
  background: #ff4757;
  transform: translateY(-2px);
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 添加一些光晕效果 */
.login-box::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 6s ease-in-out infinite;
  z-index: 0;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    width: 90%;
    flex-direction: column;
    height: auto;
  }

  .welcome-section {
    padding: 20px;
  }

  .login-section {
    padding: 20px;
  }
}

.welcome-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.logo-container {
  margin-bottom: 30px;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 8px 16px rgba(255, 107, 107, 0.2);
}

.slogan {
  font-size: 1.2em;
  color: #666;
  margin: 20px 0 40px;
  letter-spacing: 1px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateX(10px);
}

.feature-icon {
  font-size: 1.5em;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header p {
  color: #666;
  margin-top: 10px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2em;
  color: #999;
}

.form-item input {
  padding-left: 45px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
  display: inline-block;
}

.hidden-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.hidden-checkbox:checked ~ .checkmark {
  background: #ff6b6b;
  border-color: #ff6b6b;
}

.hidden-checkbox:checked ~ .checkmark::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.login-btn:hover .btn-icon {
  transform: translateX(5px);
}

.login-form > * {
  animation: fadeIn 0.5s ease forwards;
}

.login-form > *:nth-child(1) { animation-delay: 0.1s; }
.login-form > *:nth-child(2) { animation-delay: 0.2s; }
.login-form > *:nth-child(3) { animation-delay: 0.3s; }
.login-form > *:nth-child(4) { animation-delay: 0.4s; }

/* 添加悬浮效果 */
.form-item input:hover {
  border-color: #ffb3b3;
}

.forgot-link:hover {
  text-decoration: underline;
  color: #ff4757;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .features {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .feature-item {
    width: calc(50% - 20px);
  }
}
</style> 
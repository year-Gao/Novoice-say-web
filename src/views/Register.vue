<template>
  <div class="register-container">
    <div class="register-box">
      <!-- 左侧注册表单 -->
      <div class="register-section">
        <div class="register-header">
          <h2>注册</h2>
          <p>欢迎加入，开启心灵成长之旅</p>
        </div>
        <div class="register-form">
          <div class="form-item">
            <input 
              type="email" 
              v-model="email" 
              :class="{ 'has-value': email }"
              placeholder="邮箱"
              required
            >
            <span class="input-icon">📧</span>
          </div>
          
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
          
          <div class="form-item">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              v-model="confirmPassword" 
              :class="{ 'has-value': confirmPassword }"
              placeholder="确认密码"
              required
            >
            <span class="input-icon">🔒</span>
            <span class="password-toggle" @click="toggleConfirmPassword">
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </span>
          </div>
          
          <div class="register-actions">
            <button class="register-btn" @click="handleRegister" :disabled="!isFormValid">
              <span>注册</span>
              <span class="btn-icon">→</span>
            </button>
            <div class="login-link">
              已有账号？<router-link to="/login">立即登录</router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧欢迎区域 -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="logo-container">
            <img src="/树.png" alt="Logo" class="logo">
          </div>
          <h1>JOIN~</h1>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const message = inject('message')

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isFormValid = computed(() => {
  return username.value && email.value && password.value && confirmPassword.value
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleRegister = async () => {
  try {
    if (!isFormValid.value) {
      message.show('请填写所有必填项', 'error')
      return
    }

    if (password.value !== confirmPassword.value) {
      message.show('两次输入的密码不一致', 'error')
      return
    }

    const response = await axios.post('http://localhost:9999/api/users/register', {
      username: username.value,
      password: password.value,
      email: email.value
    })

    if (response.data.code === 200) {
      message.show('注册成功', 'success')
      router.push('/login')
    } else {
      message.show(response.data.message || '注册失败', 'error')
    }
  } catch (error) {
    console.error('注册失败:', error)
    message.show(error.response?.data?.message || '注册失败，请重试', 'error')
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 74vh;
  background: linear-gradient(135deg, #fce4ec 0%, #e3f2fd 100%);
}

.register-box {
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
  border-radius: 0 20px 20px 0;
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

.welcome-content {
  text-align: center;
  position: relative;
  z-index: 2;
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
  color: #666;
  font-size: 1.2em;
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

.register-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 3;
  background: rgba(255, 255, 255, 0.95);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h2 {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.register-header p {
  color: #666;
  margin-bottom: 0px;
}

.form-item {
  position: relative;
  margin-bottom: 20px;
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
  box-shadow: 0 0 0 3px rgba(255,107,107,0.1);
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2em;
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

.register-actions {
  margin-top: auto;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.register-btn:hover {
  background: #ff4757;
  transform: translateY(-2px);
}

.register-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.register-btn:hover .btn-icon {
  transform: translateX(5px);
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: #ff6b6b;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-box {
    width: 90%;
    flex-direction: column;
    height: auto;
  }

  .welcome-section {
    padding: 20px;
  }

  .register-section {
    padding: 20px;
  }
}
</style> 
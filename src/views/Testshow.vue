<template>
  <div class="testshow-container">
    <div v-if="loading" class="loading">
      加载中...
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else class="test-types-grid">
      <div v-for="(test, index) in testSets" 
           :key="index" 
           class="test-card"
           @click="goToTest(test.type)">
        <div class="test-icon">
          <i :class="getTestIcon(test.type)"></i>
        </div>
        <h3>{{ test.title }}</h3>
        <p>{{ test.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const testSets = ref([])
const loading = ref(false)
const error = ref(null)

const fetchTestSets = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/api/test/sets')
    testSets.value = response.data.data
  } catch (err) {
    console.error('获取测试集失败:', err)
    error.value = '获取测试集失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const goToTest = (type) => {
  console.log('跳转到测试页面，类型为:', type)
  router.push({
    path: '/test',
    query: { type: type }
  }).catch(err => {
    console.error('路由跳转失败:', err)
  })
}

const getTestIcon = (testType) => {
  const iconMap = {
    'emotional': 'fas fa-heart',
    'adhd': 'fas fa-brain',
    'anxiety': 'fas fa-wind',
    'autism-family': 'fas fa-home',
    'autism': 'fas fa-puzzle-piece',
    'borderline': 'fas fa-border-none',
    'depression': 'fas fa-cloud-rain',
    'eating': 'fas fa-utensils',
    'narcissism': 'fas fa-crown',
    'ocd': 'fas fa-sync',
    'ptsd': 'fas fa-exclamation',
    'career': 'fas fa-briefcase',
    'lonely': 'fas fa-user-slash',
    'personality': 'fas fa-user',
    'relationship': 'fas fa-heart',
    'attachment': 'fas fa-link',
    'therapy': 'fas fa-hand-holding-heart',
    'sleep': 'fas fa-moon',
    'dependent': 'fas fa-hands-helping',
    'qiangpo': 'fas fa-redo'
  }
  return iconMap[testType] || 'fas fa-question'
}

onMounted(() => {
  fetchTestSets()
})
</script>

<style scoped>
.testshow-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #ff4444;
  background-color: #ffebee;
  border-radius: 4px;
  margin: 20px 0;
}

.test-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.test-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

.test-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  border-color: #4CAF50;
}

.test-icon {
  text-align: center;
  margin-bottom: 15px;
  font-size: 2em;
  color: #4CAF50;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2em;
}

h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.4em;
}

p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.test-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  background-color: #ff5722;
  color: white;
}

.test-status.active {
  background-color: #4CAF50;
}

@media (max-width: 768px) {
  .test-types-grid {
    grid-template-columns: 1fr;
  }
  
  .test-card {
    margin: 10px;
  }
}
</style> 
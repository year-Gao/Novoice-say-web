<template>
  <div class="myswl-container">
    <div class="profile-header">
      <div class="profile-info">
        <img src="../assets/myswl-img/用户.jpg" alt="用户头像" class="avatar">
        <div class="user-info">
          <h2>{{ userInfo.name }}</h2>
          <p class="user-bio">{{ userInfo.bio }}</p>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-value">{{ userInfo.testCount }}</span>
          <span class="stat-label">测试次数</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userInfo.consultCount }}</span>
          <span class="stat-label">咨询次数</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userInfo.articleCount }}</span>
          <span class="stat-label">文章数</span>
        </div>
      </div>
    </div>

    <div class="content-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="tab-content">
      <!-- 根据当前选中的标签显示不同内容 -->
      <div v-if="currentTab === 'progress'" class="progress-section">
        <h3>浏览历史</h3>
        <div class="progress-cards">
          <!-- 进度卡片 -->
        </div>
      </div>

      <div v-if="currentTab === 'favorites'" class="favorites-section">
        <h3>收藏内容</h3>
        <div class="favorites-grid">
          <!-- 收藏的文章和资源 -->
        </div>
      </div>

      <div v-if="currentTab === 'settings'" class="settings-section">
        <h3>个人设置</h3>
        <form class="settings-form">
          <!-- 设置表单 -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 响应式状态
const currentTab = ref('progress')
const tabs = ref([
  { id: 'progress', name: '浏览历史' },
  { id: 'favorites', name: '我的收藏' },
  { id: 'settings', name: '个人设置' }
])

const userInfo = ref({
  name: '来一块year糕呗',
  bio: '我都说了我没病，你们为什么不信呢？',
  testCount: 12,
  consultCount: 5,
  articleCount: 3
})
</script>

<style scoped>
.myswl-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-header {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.profile-info {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 30px;
  object-fit: cover;
}

.user-info h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.user-bio {
  color: #666;
  line-height: 1.6;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  color: #42b983;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

.content-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.tab-btn {
  padding: 10px 25px;
  border: none;
  border-radius: 20px;
  background: #f8f9fa;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #42b983;
  color: white;
}

.tab-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  min-height: 400px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.tab-content h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}
</style> 
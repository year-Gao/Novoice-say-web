<template>
  <div class="news-container">
    <div class="page-header">
      <h1>平台新闻及公告</h1>
      <p class="subtitle">及时了解最新资讯</p>
    </div>

    <div class="news-filters">
      <div class="search-box">
        <input type="text" v-model="searchText" placeholder="搜索公告...">
        <button @click="searchNews">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div class="news-grid">
      <div v-for="(news, index) in filteredNews" 
           :key="index" 
           class="news-item"
           @click="showNewsDetail(news)">
        <div class="news-icon">
          <i :class="getNewsIcon(news.type)"></i>
        </div>
        <div class="news-info">
          <div class="news-tag" :class="news.type">{{ getNewsType(news.type) }}</div>
          <h3>{{ news.title }}</h3>
          <p class="news-summary">{{ news.summary }}</p>
          <div class="news-meta">
            <span class="news-date">
              <i class="far fa-calendar-alt"></i> 
              {{ formatDate(news.date) }}
            </span>
            <span class="news-views">
              <i class="far fa-eye"></i> 
              {{ formatNumber(news.views) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(-1)" class="page-btn">
        <i class="fas fa-chevron-left"></i> 上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(1)" class="page-btn">
        下一页 <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPage = ref(1)
const totalPages = ref(5)
const searchText = ref('')

const newsList = ref([
  {
    title: '心理咨询师在线时间调整通知',
    date: '2024-03-20',
    summary: '为更好地服务大家，我们调整了咨询师的在线时间安排，请查看具体时间表...',
    views: 1234,
    type: 'notice'
  },
  {
    title: '新增心理评估功能上线',
    date: '2024-03-18',
    summary: '平台新增专业的心理评估工具，帮助您更好地了解自己的心理状态...',
    views: 856,
    type: 'update'
  },
  {
    title: '心理健康月活动预告',
    date: '2024-03-15',
    summary: '4月是心理健康月，我们准备了一系列免费讲座和团体活动...',
    views: 2100,
    type: 'activity'
  },
  {
    title: '在线心理咨询平台使用指南',
    date: '2024-03-12',
    summary: '为帮助新用户更好地使用平台功能，我们编写了详细的平台使用指南，包含预约、咨询等功能说明...',
    views: 1580,
    type: 'notice'
  }
])

const filteredNews = computed(() => {
  let news = [...newsList.value]
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    news = news.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.summary.toLowerCase().includes(searchLower)
    )
  }
  return news
})

const showNewsDetail = (news) => {
  router.push({
    name: 'NewsDetail',
    params: { id: news.id }
  })
}

const changePage = (delta) => {
  currentPage.value += delta
}

const searchNews = () => {
  currentPage.value = 1
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatNumber = (num) => {
  return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}

const getNewsIcon = (type) => {
  const icons = {
    notice: 'fas fa-bullhorn',
    update: 'fas fa-sync-alt',
    activity: 'fas fa-calendar-check'
  }
  return icons[type] || 'fas fa-file-alt'
}

const getNewsType = (type) => {
  const types = {
    notice: '通知公告',
    update: '功能更新',
    activity: '活动预告'
  }
  return types[type] || '公告'
}
</script>

<style scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #fff;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
}

.page-header h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
  font-weight: 600;
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1em;
}

.news-filters {
  margin-bottom: 40px;
}

.search-box {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 50px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}

.search-box input {
  flex: 1;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  background: white;
}

.search-box button {
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.search-box button:hover {
  transform: scale(1.05);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.news-item {
  background: white;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eef2f7;
  display: flex;
  gap: 20px;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.news-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
}

.news-info {
  flex: 1;
}

.news-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  margin-bottom: 10px;
}

.notice {
  background: #e3f2fd;
  color: #1976d2;
}

.update {
  background: #e8f5e9;
  color: #43a047;
}

.activity {
  background: #fff3e0;
  color: #f57c00;
}

.news-info h3 {
  margin: 0 0 12px;
  color: #2c3e50;
  font-size: 1.2em;
  line-height: 1.4;
}

.news-summary {
  color: #7f8c8d;
  font-size: 0.95em;
  line-height: 1.6;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  gap: 20px;
  color: #95a5a6;
  font-size: 0.9em;
}

.news-meta i {
  margin-right: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

.page-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.page-info {
  font-size: 1.1em;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 1.8em;
  }
}
</style> 
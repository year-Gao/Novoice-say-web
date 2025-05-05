<template>
  <div class="history-container">
    <h1 class="page-title">历史测验记录</h1>
    
    <div class="history-list">
      <div v-for="test in testHistory" :key="test.id" class="history-card">
        <div class="test-info">
          <div class="test-type">{{ test.type }}</div>
          <div class="test-date">{{ formatDate(test.date) }}</div>
        </div>
        <div class="test-result">
          <h3>{{ test.title }}</h3>
          <p class="result-summary">{{ test.summary }}</p>
        </div>
        <div class="card-actions">
          <button class="view-btn" @click="viewDetail(test.id)">查看详情</button>
          <button class="retake-btn" @click="retakeTest(test.type)">重新测试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const testHistory = ref([
  {
    id: 1,
    type: 'obsessive',
    date: '2024-12-20',
    title: 'Yale-Brown强迫测验结果',
    summary: '你并不是一个非常强迫的人，你有很强的松弛感...'
  },
  {
    id: 2,
    type: 'pressure',
    date: '2024-12-15',
    title: '压力水平测试结果',
    summary: '当前压力水平适中，建议通过适当运动和休息来维持...'
  }
]);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
};

const viewDetail = (id) => {
  router.push({
    path: "/result",
    query: {
      resultId: id * 10,
      type: 'obsessive'
    }
  });
};

const retakeTest = (type) => {
  router.push({
    path: '/test',
    query: { type }
  });
};
</script>

<style scoped>
.history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2em;
  margin-bottom: 40px;
}

.history-list {
  display: grid;
  gap: 20px;
}

.history-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.history-card:hover {
  transform: translateY(-5px);
}

.test-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.test-type {
  color: #42b983;
  font-weight: 600;
}

.test-date {
  color: #666;
}

.test-result h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.result-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-actions {
  display: flex;
  gap: 15px;
}

.view-btn, .retake-btn {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn {
  background: #42b983;
  color: white;
}

.retake-btn {
  background: #f8f9fa;
  color: #42b983;
  border: 1px solid #42b983;
}

.view-btn:hover, .retake-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66,185,131,0.2);
}
</style> 
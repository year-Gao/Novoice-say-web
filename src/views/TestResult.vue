<template>
  <div class="result-container">
    <div class="result-card">
      <h1 class="page-title">测试结果分析</h1>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-else-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">
          <h2>正在分析测试结果</h2>
          <p>请稍候，我们正在为您生成详细的测试分析报告...</p>
          <div class="loading-progress">
            <div class="progress-bar">
              <div class="progress-inner"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="result" class="result-content">
        <div class="result-header">
          <div class="test-type">
            <i class="fas fa-clipboard-check"></i>
            <h2>{{ result.testSetTitle }}</h2>
            <span class="test-type-label">({{ getTestTypeName(result.testSetType) }})</span>
          </div>
          <div class="result-type">
            <span class="result-badge" :class="getResultClass(result.resultType)">
              {{ result.resultType }}
            </span>
          </div>
        </div>
        
        <div class="score-section">
          <div class="score-circle">
            <span class="score-number">{{ result.totalScore }}</span>
            <span class="score-label">总分</span>
          </div>
        </div>

        <div class="description">
          <h3><i class="fas fa-chart-line"></i> 结果分析</h3>
          <div class="description-content">
            {{ result.resultDescription }}
          </div>
        </div>

        <div class="detailed-analysis">
          <div class="dimensions-grid">
            <div v-for="(score, dimension) in result.dimensionScores" 
                 :key="dimension" 
                 class="dimension-card">
              <h4>{{ dimension }}</h4>
              <div class="progress-bar">
                <div class="progress" 
                     :style="{ width: `${score}%` }"
                     :class="getDimensionClass(score)">
                  {{ score }}分
                </div>
              </div>
              <template v-if="result.dimensionResults && result.dimensionResults[dimension]">
                <p class="dimension-diagnosis">
                  {{ result.dimensionResults[dimension].diagnosis }}
                </p>
                <div class="dimension-suggestions">
                  <ul>
                    <li v-for="(suggestion, idx) in result.dimensionResults[dimension].suggestions"
                        :key="idx">
                      {{ suggestion }}
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </div>

          <div class="recommendations" v-if="result.generalSuggestions && result.generalSuggestions.length">
            <h3><i class="fas fa-lightbulb"></i> 总体建议</h3>
            <div class="recommendations-list">
              <div v-for="(suggestion, index) in result.generalSuggestions" 
                   :key="index" 
                   class="recommendation-card">
                <div class="rec-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <p>{{ suggestion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="retakeTest" class="retake-button">
          <i class="fas fa-redo"></i> 重新测试
        </button>
        <button @click="shareResult" class="share-button">
          <i class="fas fa-share-alt"></i> 分享结果
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const result = ref(null)
const loading = ref(true)
const error = ref(null)

const getTestTypeName = (type) => {
  const types = {
    'YALR_BROWN': '耶鲁-布朗强迫量表测试',
    'emotional': '情感表达能力测试',
    'adhd': 'ADHD测试',
    'anxiety': '焦虑程度测试'
  }
  return types[type] || type
}

const getResultClass = (type) => {
  const classes = {
    'MILD': 'result-mild',
    'MODERATE': 'result-moderate',
    'SEVERE': 'result-severe'
  }
  return classes[type] || 'result-mild'
}

const getDimensionClass = (score) => {
  if (score >= 80) return 'progress-high'
  if (score >= 60) return 'progress-medium'
  return 'progress-low'
}

const fetchResult = async () => {
  loading.value = true
  error.value = null
  try {
    const resultId = route.query.resultId
    if (!resultId) {
      throw new Error('未找到测试结果ID')
    }

    // 添加轮询机制
    let retryCount = 0
    const maxRetries = 30 // 最多轮询30次，每次3秒，总共最多等待90秒
    
    const pollResult = async () => {
      const response = await axios.get(`http://localhost:9999/api/test/result/${resultId}`)
      
      if (response.data.code === 200) {
        const data = response.data.data
        
        // 检查分析状态
        if (data.status === 'analyzing') {
          // 如果还在分析中，并且未超过最大重试次数，则继续轮询
          if (retryCount < maxRetries) {
            retryCount++
            await new Promise(resolve => setTimeout(resolve, 3000)) // 等待3秒
            return pollResult()
          } else {
            throw new Error('分析时间过长，请稍后刷新页面查看结果')
          }
        }
        
        // 分析完成，显示结果
        result.value = {
          ...data,
          resultDescription: data.resultDescription || `根据${getTestTypeName(data.testSetType)}，您的总分为${data.totalScore}分。`
        }
      } else {
        throw new Error(response.data.message || '获取测试结果失败')
      }
    }

    await pollResult()
  } catch (err) {
    error.value = err.message || '获取测试结果失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const retakeTest = () => {
  router.push('/testshow')
}

const shareResult = () => {
  router.put('/nogood')
}

onMounted(() => {
  fetchResult()
})
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.result-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 800px;
  padding: 30px;
}

.page-title {
  color: #2c3e50;
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.test-type {
  display: flex;
  align-items: center;
  gap: 10px;
}

.test-type i {
  color: #F39B98;
  font-size: 24px;
}

.test-type h2 {
  color: #2c3e50;
  font-size: 20px;
  margin: 0;
}


.result-mild { 
  background: #4CAF50; /* 轻度 - 绿色 */
}
.result-moderate { 
  background: #FFC107; /* 中度 - 黄色 */
}
.result-severe { 
  background: #FF5722; /* 重度 - 红色 */
}

.score-section {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F39B98, #f7b5b3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 4px 15px rgba(243, 155, 152, 0.3);
}

.score-number {
  font-size: 48px;
  font-weight: bold;
}

.score-label {
  font-size: 16px;
  margin-top: 5px;
}

.description {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
}

.description h3 {
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.description-content {
  line-height: 1.6;
  color: #4a5568;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.retake-button, .share-button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.retake-button {
  background: #F39B98;
  color: white;
}

.share-button {
  background: #e9ecef;
  color: #495057;
}

.retake-button:hover {
  background: #f7b5b3;
  transform: translateY(-2px);
}

.share-button:hover {
  background: #dee2e6;
  transform: translateY(-2px);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.loading-text {
  margin-top: 20px;
}

.loading-text h2 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 10px;
}

.loading-text p {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.loading-progress {
  width: 100%;
  max-width: 300px;
  margin: 20px auto;
}

.progress-bar {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-inner {
  position: absolute;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, #F39B98, transparent);
  animation: progress 1.5s ease infinite;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #F39B98;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes progress {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc3545;
  padding: 20px;
  background: #fff5f5;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
}

.detailed-analysis {
  margin-top: 40px;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  text-align: center;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.dimension-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.progress-bar {
  background: #f0f0f0;
  border-radius: 10px;
  height: 20px;
  margin: 10px 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
  color: white;
  text-align: right;
  padding-right: 10px;
  line-height: 20px;
}

.progress-high { background: #91CC75; }
.progress-medium { background: #FAC858; }
.progress-low { background: #EE6666; }

.recommendations-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.recommendation-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.recommendation-card p {
  margin: 10px 0 0;
  color: #4a5568;
  line-height: 1.5;
}

.test-type-label {
  color: #666;
  font-size: 14px;
  margin-left: 8px;
}

.result-type {
  display: flex;
  align-items: center;
}

.result-badge {
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.dimension-diagnosis {
  margin-top: 10px;
  color: #2c3e50;
  font-weight: 500;
}

.dimension-suggestions {
  margin-top: 10px;
}

.dimension-suggestions ul {
  list-style-type: none;
  padding-left: 0;
}

.dimension-suggestions li {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
  padding-left: 20px;
  position: relative;
}

.dimension-suggestions li:before {
  content: "•";
  position: absolute;
  left: 8px;
  color: #F39B98;
}

.radar-chart, 
.line-chart, 
.bar-chart {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
}

.chart-section h3,
.trend-section h3,
.comparison h3 {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.trend-section,
.comparison {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  text-align: center;
}

@media (max-width: 768px) {
  .radar-chart, 
  .line-chart, 
  .bar-chart {
    max-width: 100%;
  }
}
</style> 
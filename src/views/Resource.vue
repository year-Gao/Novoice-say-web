<template>
  <div class="resource-container">
    
    <!-- 资源分类导航 -->
    <div class="resource-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        <i :class="tab.icon"></i>
        {{ tab.name }}
      </button>
    </div>

    <!-- 资源内容区域 -->
    <transition name="fade" mode="out-in">
      <div class="resource-content">
        <!-- 文章资源 -->
        <div v-if="currentTab === 'articles'" class="resource-grid">
          <div 
            v-for="article in articles" 
            :key="article.id" 
            class="resource-card"
            @click="readArticle(article.id)"
          >
            <div class="card-image">
              <img :src="article.cover" :alt="article.title">
              <div class="card-tag">{{ article.tag }}</div>
            </div>
            <div class="card-content">
              <h3>{{ article.title }}</h3>
              <p>{{ article.description }}</p>
              <div class="card-footer">
                <span class="read-time">{{ article.readTime }}分钟阅读</span>
                <span class="read-more">阅读更多 →</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 视频资源 -->
        <div v-if="currentTab === 'videos'" class="resource-grid">
          <div 
            v-for="video in videos" 
            :key="video.id" 
            class="resource-card video-card"
            @click="playVideo(video.id)"
          >
            <div class="video-thumbnail">
              <img :src="video.thumbnail" :alt="video.title">
              <div class="play-icon">
                <i class="fas fa-play-circle"></i>
              </div>
              <div class="video-duration">{{ video.duration }}</div>
            </div>
            <div class="card-content">
              <h3>{{ video.title }}</h3>
              <p>{{ video.description }}</p>
              <div class="video-info">
                <span><i class="fas fa-eye"></i> {{ video.views }}</span>
                <span><i class="fas fa-heart"></i> {{ video.likes }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 图片资源 -->
        <div v-if="currentTab === 'images'" class="resource-grid image-grid">
          <div 
            v-for="image in images" 
            :key="image.id" 
            class="image-card"
            @click="showImageDetail(image)"
          >
            <div class="image-wrapper">
              <img :src="image.url" :alt="image.title">
              <div class="image-overlay">
                <h4>{{ image.title }}</h4>
                <p>{{ image.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTab = ref('articles')

const tabs = [
  { id: 'articles', name: '治愈文章', icon: 'fas fa-book-reader' },
  { id: 'videos', name: '心理视频', icon: 'fas fa-video' },
  { id: 'images', name: '心灵图片', icon: 'fas fa-images' }
]

const getImageUrl = (name) => {
  return new URL(`../assets/resource-img/${name}.jpg`, import.meta.url).href
}

const articles = ref([
  {
    id: 1,
    title: '如何缓解焦虑情绪',
    description: '通过科学的方法和日常练习，让我们一起学习如何与焦虑共处，找回内心的平静...',
    cover: getImageUrl('如何缓解焦虑情绪'),
    tag: '情绪管理', 
    readTime: 8
  },
  {
    id: 2,
    title: '正念冥想入门指南',
    description: '正念冥想不仅能够帮助我们放松身心，还能提升专注力和幸福感...',
    cover: getImageUrl('正念冥想入门指南'),
    tag: '心理练习',
    readTime: 12
  },
  {
    id: 3,
    title: '改善睡眠质量的10个小技巧',
    description: '优质的睡眠是身心健康的基础，让我们一起探索如何获得更好的睡眠...',
    cover: getImageUrl('改善睡眠质量的10个小技巧'),
    tag: '生活习惯',
    readTime: 10
  },
  {
    id: 4,
    title: '与抑郁共处：自我疗愈指南',
    description: '面对抑郁时，如何照顾好自己？实用的自我疗愈方法分享...',
    cover: getImageUrl('与抑郁共处自我疗愈指南'),
    tag: '心理健康',
    readTime: 15
  },
  {
    id: 5,
    title: '提升自信心的实践方法',
    description: '建立自信不是一蹴而就，需要循序渐进的练习和积累...',
    cover: getImageUrl('提升自信心的实践方法'),
    tag: '个人成长',
    readTime: 9
  }
])

const videos = ref([
  {
    id: 1,
    title: '压力管理技巧',
    description: '专业心理咨询师教你应对生活压力的实用方法',
    duration: '15:30',
    thumbnail: getImageUrl('压力管理技巧'),
    views: '2.3k',
    likes: 156
  },
  {
    id: 2,
    title: '情绪调节方法',
    description: '学会识别和调节自己的情绪状态',
    duration: '12:45',
    thumbnail: getImageUrl('情绪调节方法'),
    views: '1.8k',
    likes: 142
  },
  {
    id: 3,
    title: '正念呼吸练习指导',
    description: '10分钟正念呼吸练习，帮助你随时随地放松身心',
    duration: '10:15',
    thumbnail: getImageUrl('正念呼吸练习指导'),
    views: '3.5k',
    likes: 289
  },
  {
    id: 4,
    title: '心理健康科普讲座',
    description: '了解心理健康的重要性，破除常见心理健康误区',
    duration: '20:30',
    thumbnail: getImageUrl('心理健康科普讲座'),
    views: '4.2k',
    likes: 315
  },
  {
    id: 5,
    title: '自我关爱练习课程',
    description: '学习如何更好地关爱自己，建立健康的自我关系',
    duration: '18:20',
    thumbnail: getImageUrl('自我关爱练习课程'),
    views: '2.8k',
    likes: 198
  }
])

const images = ref([
  {
    id: 1,
    title: '心理健康海报',
    description: '积极正向的心理健康理念',
    url: getImageUrl('心理健康海报')
  },
  {
    id: 2,
    title: '情绪管理图解',
    description: '可视化的情绪管理指南',
    url: getImageUrl('情绪管理图解')
  },
  {
    id: 3,
    title: '正念生活插画',
    description: '通过艺术展现正念生活的美好',
    url: getImageUrl('正念生活插画')
  },
  {
    id: 4,
    title: '心理健康知识图谱',
    description: '系统化展示心理健康知识体系',
    url: getImageUrl('心理健康知识图谱')
  },
  {
    id: 5,
    title: '情绪词汇表',
    description: '丰富的情绪词汇助你更好地表达内心感受',
    url: getImageUrl('情绪词汇表')
  },
  {
    id: 6,
    title: '治愈系插画集',
    description: '温暖治愈的艺术作品',
    url: getImageUrl('治愈系插画集')
  }
])

const readArticle = (id) => {
  router.push(`/article/${id}`)
}

const playVideo = (id) => {
  router.push(`/video/${id}`)
}

const showImageDetail = (image) => {
  // 实现图片预览功能
}
</script>

<style scoped>
.resource-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f6f8ff 0%, #f0f3ff 100%);
  min-height: 100vh;
}


.resource-nav {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 20px;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: linear-gradient(to right, #ffffff, #f8f9ff);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1em;
  color: #666;
  box-shadow: 0 2px 8px rgba(124, 105, 239, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  border: 1px solid rgba(124, 105, 239, 0.1);
}

.tab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 105, 239, 0.2);
  border-color: rgba(124, 105, 239, 0.2);
}

.tab-btn.active {
  background: linear-gradient(45deg, #7c69ef, #5d9cec);
  color: white;
  border: none;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.resource-card {
  background: linear-gradient(to bottom right, #ffffff, #fafbff);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(124, 105, 239, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(124, 105, 239, 0.1);
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(124, 105, 239, 0.15);
  border-color: rgba(124, 105, 239, 0.2);
}

.card-image {
  position: relative;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(45deg, #7c69ef, #5d9cec);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  box-shadow: 0 2px 8px rgba(124, 105, 239, 0.3);
}

.card-content {
  position: relative;
  padding: 15px;
}

.card-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15px;
  right: 15px;
  height: 1px;
  background: linear-gradient(to right, 
    rgba(124, 105, 239, 0.1), 
    rgba(93, 156, 236, 0.1)
  );
}

.card-content h3 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.2em;
}

.card-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.read-time {
  color: #888;
  font-size: 0.9em;
}

.read-more {
  background: linear-gradient(45deg, #7c69ef, #5d9cec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

/* 动画过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .resource-grid {
    grid-template-columns: 1fr;
  }
  
  .resource-nav {
    justify-content: flex-start;
    padding: 10px 20px;
  }
  
  .tab-btn {
    width: auto;
  }
}

/* 移除图标的额外样式 */
.tab-btn i {
  font-size: 1em;
}

.video-info {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  color: #666;
  font-size: 0.9em;
}

.video-info span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.video-info i {
  background: linear-gradient(45deg, #7c69ef, #5d9cec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 视频卡片特定样式 */
.video-thumbnail {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 3em;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.video-duration {
  background: linear-gradient(45deg, rgba(124, 105, 239, 0.9), rgba(93, 156, 236, 0.9));
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.video-card:hover .play-icon {
  opacity: 1;
}

/* 图片网格使用不同的布局 */
.image-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 15px;
}

/* 调整图片卡片的高度 */
.image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 15px;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  background: linear-gradient(to top, 
    rgba(124, 105, 239, 0.9), 
    rgba(93, 156, 236, 0.7)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

/* ��应式布局调整 */
@media (min-width: 1440px) {
  .resource-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .image-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 768px) {
  .resource-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
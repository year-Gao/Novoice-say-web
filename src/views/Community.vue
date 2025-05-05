<template>
  <div class="community-container">
    <div class="welcome-message">
      <h1>轻娱轶事</h1>
      <p>温暖角落的角落，常有佳人相伴 🌈</p>
    </div>

    <!-- 发帖区域 -->
    <div class="post-form">
      <div class="mood-selector">
        <span>今天的心情：</span>
        <button 
          v-for="mood in moods" 
          :key="mood"
          @click="selectMood(mood)"
          :class="['mood-btn', newPost.mood === mood ? 'selected' : '']"
        >
          {{ mood }}
        </button>
      </div>
      <input v-model="newPost.username" placeholder="给自己起个暖暖的昵称吧~" class="username-input">
      <textarea v-model="newPost.content" placeholder="分享你的心情，这里有人倾听..." class="content-input"></textarea>
      <button @click="createPost" class="post-button">分享心情</button>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <span class="username">{{ post.username  }}</span>
          <span class="time">{{ formatTime(post.createTime) }}</span>
        </div>
        
        <div class="post-content">{{ post.content }}</div>
        
        <div class="post-actions">
          <button @click="likePost(post)" class="action-button">
            👍 {{ post.likes }}
          </button>
          
          <button @click="post.showComments = !post.showComments" class="action-button">
            💬 {{ post.comments.length }}
          </button>
        </div>

        <!-- 评论区域 -->
        <div v-if="post.showComments" class="comments-section">
          <h3>评论区</h3>
          
          <div v-if="post.comments.length === 0" class="no-comments">
            暂无评论，来说两句吧~
          </div>
          
          <div v-else>
            <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
              <div class="comment-header">
                <span class="comment-user">{{ comment.username || '匿名用户' }}</span>
                <span class="comment-time">{{ formatDate(comment.createTime) }}</span>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
            </div>
          </div>

          <div class="comment-input">
            <textarea 
              v-model="post.newComment.content" 
              placeholder="写下你的评论..."
            ></textarea>
            <div class="comment-actions">
              <button class="submit-comment" @click="addComment(post)">
                发表评论
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

// 响应式状态
const posts = ref([])
const moods = ref(['😊 开心', '😢 难过', '😡 生气', '😌 平静', '🤔 困惑'])
const newPost = ref({
  username: '',
  content: '',
  mood: ''
})

// 获取所有帖子
const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:9999/api/posts')
    posts.value = await Promise.all(response.data.data.map(async post => {
      const commentsResponse = await axios.get(`http://localhost:9999/api/comments/post/${post.id}`)
      return {
        ...post,
        showComments: false,
        comments: commentsResponse.data.data,
        newComment: {
          content: ''
        }
      }
    }))
  } catch (error) {
    console.error('获取帖子失败:', error)
  }
}

// 选择心情
const selectMood = (mood) => {
  newPost.value.mood = mood
}

// 创建新帖子
const createPost = async () => {
  if (!newPost.value.content.trim()) return
  
  try {
    const userId = localStorage.getItem('userId')
    
    await axios.post('http://localhost:9999/api/posts', {
      content: newPost.value.content,
      mood: newPost.value.mood,
      username: newPost.value.username || '匿名用户',
      userId: userId,
      likes: 0
    })
    
    newPost.value.content = ''
    newPost.value.mood = ''
    await fetchPosts()
  } catch (error) {
    console.error('发布帖子失败:', error)
  }
}

// 点赞帖子
const likePost = async (post) => {
  try {
    const response = await axios.put(`http://localhost:9999/api/posts/${post.id}/like`)
    if (response.data.code === 200) {
      post.likes = response.data.data.likes
    }
  } catch (error) {
    console.error('点赞请求失败:', error.response?.data || error.message)
    if (post.likes > 0) {
      post.likes--
    }
  }
}

// 添加评论
const addComment = async (post) => {
  if (!post.newComment.content.trim()) return
  
  try {
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')
    
    const comment = {
      postId: post.id,
      userId: userId,
      username: username || '温暖用户',
      content: post.newComment.content,
      createTime: new Date()
    }
    
    await axios.post('http://localhost:9999/api/comments', comment)
    const response = await axios.get(`http://localhost:9999/api/comments/post/${post.id}`)
    post.comments = response.data.data
    post.newComment.content = ''
  } catch (error) {
    console.error('发表评论失败:', error)
  }
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = dayjs(time)
  const now = dayjs()
  const diffMinutes = now.diff(date, 'minute')
  
  if (diffMinutes < 1) return '刚刚'
  if (diffMinutes < 60) return `${diffMinutes}分钟前`
  
  const diffHours = now.diff(date, 'hour')
  if (diffHours < 24) return `${diffHours}小时前`
  
  const diffDays = now.diff(date, 'day')
  if (diffDays < 30) return `${diffDays}天前`
  
  return date.format('YYYY年MM月DD日 HH:mm')
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 组件挂载时获取帖子列表
onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.community-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(to bottom, #f7f9fc, #fff);
  min-height: 50vh;
}

.welcome-message {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  animation: fadeIn 1s ease-in;
}

.welcome-message h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #2196F3, #4CAF50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-message p {
  color: #666;
  font-size: 1.1em;
}

.post-form {
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.post-form:hover {
  transform: translateY(-5px);
}

.mood-selector {
  margin-bottom: 15px;
}

.mood-btn {
  border: none;
  padding: 8px 15px;
  margin: 0 5px;
  border-radius: 20px;
  cursor: pointer;
  background: #f5f5f5;
  transition: all 0.3s ease;
}

.mood-btn.selected {
  background: #4CAF50;
  color: white;
  transform: scale(1.05);
}

.username-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

.content-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 20px;
  resize: none;
  transition: border-color 0.3s ease;
}

.username-input:focus,
.content-input:focus {
  border-color: #4CAF50;
  outline: none;
}

.post-button {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s ease;
}

.post-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76,175,80,0.3);
}

.post-card {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease-out;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.post-header {
    display: flex;
    justify-content: space-between;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.comment-button {
  background: linear-gradient(45deg, #2196F3, #1976D2);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.comment-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(33,150,243,0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 添加响应式设计 */
@media (max-width: 600px) {
  .community-container {
    padding: 10px;
  }
  
  .post-form {
    padding: 15px;
  }
  
  .welcome-message h1 {
    font-size: 2em;
  }
}

/* 评论区样式 */
.comments-section {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.comment-item {
  padding: 12px;
  margin-bottom: 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: 600;
  color: #2c3e50;
}

.comment-time {
  font-size: 0.85em;
  color: #666;
}

.comment-content {
  color: #333;
  line-height: 1.5;
  margin: 8px 0;
}

.comment-input {
  margin-top: 15px;
}

.comment-input textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 80px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.submit-comment {
  padding: 6px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-comment:hover {
  background: #45a049;
}

/* 如果评论为空时的提示样式 */
.no-comments {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}
</style> 
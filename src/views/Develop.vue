<template>
  <div class="develop-container">
    <h1 class="page-title">程序猿正在快马加鞭的码程序...敬请期待</h1>
    
    <div class="consultation-area">
      <!-- 专家列表 -->
      <div class="experts-list">
        <h2>在线专家</h2>
        <div v-for="expert in experts" :key="expert.id" class="expert-card">
          <img :src="expert.avatar" :alt="expert.name" class="expert-avatar">
          <div class="expert-info">
            <h3>{{ expert.name }}</h3>
            <p class="expert-title">{{ expert.title }}</p>
            <p class="expert-specialty">专长：{{ expert.specialty }}</p>
            <div class="expert-status" :class="{ 'online': expert.isOnline }">
              {{ expert.isOnline ? '在线' : '离线' }}
            </div>
            <button @click="startConsultation(expert)" 
                    :disabled="!expert.isOnline"
                    class="consult-btn">
              开始问诊
            </button>
          </div>
        </div>
      </div>

      <!-- 问诊区域 -->
      <div class="chat-area" v-if="selectedExpert">
        <div class="chat-header">
          <h3>与 {{ selectedExpert.name }} 的对话</h3>
        </div>
        <div class="chat-messages" ref="chatMessages">
          <div v-for="(message, index) in messages" 
               :key="index"
               :class="['message', message.type]">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <textarea v-model="newMessage" 
                    placeholder="请输入您的问题..."
                    @keyup.enter="sendMessage"></textarea>
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref(1)
const selectedExpert = ref(null)
const messages = ref([])
const newMessage = ref('')

const getImageUrl = (name) => {
  return new URL(`../assets/develop-img/${name}.jpg`, import.meta.url).href
}

const experts = ref([
  {
    id: 1,
    name: '张医生',
    title: '主任医师',
    specialty: '抑郁症、焦虑症、失眠',
    avatar: getImageUrl('心理学家1'),
    isOnline: true
  },
  {
    id: 2,
    name: '李医生',
    title: '副主任医师',
    specialty: '青少年心理咨询、家庭关系',
    avatar: getImageUrl('心理学家2'),
    isOnline: false
  }
])

function startConsultation(expert) {
  selectedExpert.value = expert
  messages.value = [
    {
      type: 'system',
      content: `您已开始与${expert.name}的问诊会话`,
      time: new Date().toLocaleTimeString()
    }
  ]
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  
  messages.value.push({
    type: 'user',
    content: newMessage.value,
    time: new Date().toLocaleTimeString()
  })
  
  newMessage.value = ''
  
  setTimeout(() => {
    messages.value.push({
      type: 'expert',
      content: '感谢您的咨询，我理解您的困扰。让我们进一步了解一下具体情况...',
      time: new Date().toLocaleTimeString()
    })
  }, 1000)
}
</script>

<style scoped>
.develop-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
  font-size: 2.2em;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.consultation-area {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.experts-list {
  border-right: 2px solid #eef2f7;
  padding-right: 25px;
}

.experts-list h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #42b983;
}

.expert-card {
  border: none;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: start;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.expert-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.expert-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin-right: 20px;
  border: 3px solid #42b983;
  padding: 3px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(66,185,131,0.2);
}

.expert-avatar:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.expert-info h3 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.2em;
}

.expert-title {
  color: #42b983;
  font-weight: 600;
  margin-bottom: 5px;
}

.expert-specialty {
  color: #666;
  font-size: 0.9em;
  line-height: 1.4;
  margin-bottom: 10px;
}

.expert-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  background: #f5f5f5;
}

.expert-status.online {
  background: #e3f9ef;
  color: #42b983;
}

.consult-btn {
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 10px;
  width: 100%;
}

.consult-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66,185,131,0.3);
}

.chat-area {
  border: none;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  height: 700px;
}

.chat-header {
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 2px solid #eef2f7;
  border-radius: 20px 20px 0 0;
}

.chat-header h3 {
  color: #2c3e50;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-header h3::before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #42b983;
  border-radius: 50%;
}

.chat-messages {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.message {
  margin-bottom: 25px;
  max-width: 70%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  margin-left: auto;
}

.message.expert {
  margin-right: auto;
}

.message-content {
  padding: 15px 20px;
  border-radius: 18px;
  font-size: 1em;
  line-height: 1.6;
  position: relative;
}

.message.system .message-content {
  background: #f8f9fa;
  color: #666;
  text-align: center;
  margin: 30px auto;
  font-size: 0.9em;
  max-width: 80%;
  border: 1px dashed #ddd;
  padding: 12px 25px;
}

.message.expert .message-content {
  background: #f0f7ff;
  color: #2c3e50;
  border-radius: 18px 18px 18px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.message.expert .message-content::before {
  content: "";
  position: absolute;
  bottom: -8px;
  left: -8px;
  width: 20px;
  height: 20px;
  background: #f0f7ff;
  border-radius: 50%;
  z-index: -1;
}

.message.user .message-content {
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white;
  border-radius: 18px 18px 0 18px;
  box-shadow: 0 2px 8px rgba(66,185,131,0.2);
}

.message.user .message-content::before {
  content: "";
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  border-radius: 50%;
  z-index: -1;
}

.message-time {
  font-size: 0.8em;
  color: #999;
  margin-top: 8px;
  padding: 0 10px;
}

.message.user .message-time {
  text-align: right;
}

.chat-input {
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 2px solid #eef2f7;
  border-radius: 0 0 20px 20px;
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.chat-input textarea {
  flex: 1;
  min-height: 60px;
  max-height: 120px;
  border: 2px solid #eef2f7;
  border-radius: 15px;
  padding: 15px 20px;
  font-size: 1em;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
  background: #ffffff;
}

.chat-input textarea:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 4px rgba(66,185,131,0.1);
}

.chat-input button {
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white;
  border: none;
  height: 50px;
  padding: 0 35px;
  border-radius: 15px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66,185,131,0.2);
}

.chat-input button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66,185,131,0.3);
}

.chat-input button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(66,185,131,0.2);
}
</style> 
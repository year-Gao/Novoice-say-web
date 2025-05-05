<template>
  <div class="about-container">
    <div class="about-header">
      <h1>关于 SWL</h1>
      <p class="subtitle">The Spiritual Wisdom Language</p>
    </div>

    <div class="content-grid">
      <div class="info-card mission">
        <h2>我们的使命</h2>
        <p>通过心理健康服务和教育，帮助每个人实现更好的自我认知和心理成长。</p>
      </div>

      <div class="info-card values">
        <h2>核心价值观</h2>
        <ul>
          <li>专业性：提供科学、专业的心理健康服务</li>
          <li>关爱：以同理心和温暖对待每一位用户</li>
          <li>成长：促进个人持续成长和自我提升</li>
        </ul>
      </div>

      <div class="info-card features">
        <h2>特色服务</h2>
        <div class="feature-list">
          <div class="feature-item">
            <i class="fas fa-brain"></i>
            <span>心理测评</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-comments"></i>
            <span>在线咨询</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-book-reader"></i>
            <span>心灵智语</span>
          </div>
        </div>
      </div>

      <div class="info-card contact">
        <h2>联系我们</h2>
        <div class="contact-info">
          <p><i class="fas fa-envelope"></i> Email: Year-gao@163.com</p>
          <p><i class="fas fa-phone"></i> 电话: 18470508928</p>
          <p><i class="fas fa-map-marker-alt"></i> 地址: 江西南昌老师大</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'About'
})
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
}

.about-header h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.2em;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card h2 {
  color: #42b983;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.mission p {
  line-height: 1.8;
  color: #2c3e50;
}

.values ul {
  list-style: none;
  padding: 0;
}

.values li {
  margin-bottom: 15px;
  padding-left: 20px;
  position: relative;
  color: #2c3e50;
}

.values li::before {
  content: "•";
  color: #42b983;
  font-size: 1.5em;
  position: absolute;
  left: 0;
  top: -5px;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #42b983;
  color: white;
}

.feature-item i {
  font-size: 2em;
  margin-bottom: 10px;
  display: block;
}

.contact-info {
  color: #2c3e50;
}

.contact-info p {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-info i {
  color: #42b983;
  width: 20px;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
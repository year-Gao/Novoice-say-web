<template>
  <div class="develop-container">
    <div class="develop-content">
      <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" alt="开发中" class="develop-gif">
      <h1 class="title">🚧 程序猿正在疯狂码字中 🚧</h1>
      
      <div class="funny-text">
        <p>亲爱的用户：</p>
        <p>这个功能正在被我们的程序员们用爱❤️和咖啡☕️精心打造中...</p>
        <p>他们正在与Bug展开殊死搏斗，请稍后再来看看吧！</p>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-animation"></div>
          </div>
          <p class="loading-text">加载中... 已完成39%</p>
        </div>
        
        <div class="fun-facts">
          <p>有趣的小知识：</p>
          <ul>
            <li>在你看到这个页面的时候，可能程序员正在喝第8杯咖啡 ☕️</li>
            <li>今天已经修复了约42个Bug，但不小心又创造了17个新Bug 🐛</li>
            <li>为了这个功能，我们的程序员已经熬了3个通宵（别担心，我们定期给他们补充零食）🍪</li>
          </ul>
        </div>
      </div>

      <router-link to="/" class="home-button">
        先去首页逛逛吧 →
      </router-link>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.develop-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.develop-content {
  max-width: 800px;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.develop-gif {
  width: 200px;
  margin-bottom: 20px;
}

.title {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2em;
}

.funny-text {
  margin: 20px 0;
  line-height: 1.6;
  color: #34495e;
}

.progress-container {
  margin: 30px 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
}

.progress-animation {
  width: 39%;
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  animation: progress 2s ease-in-out infinite;
}

.loading-text {
  margin-top: 10px;
  color: #666;
}

.fun-facts {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.fun-facts ul {
  list-style-type: none;
  padding-left: 0;
}

.fun-facts li {
  margin: 10px 0;
  padding-left: 20px;
  position: relative;
}

.fun-facts li:before {
  content: "→";
  position: absolute;
  left: 0;
}

.home-button {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.home-button:hover {
  background: #3aa876;
  transform: translateY(-2px);
}

@keyframes progress {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
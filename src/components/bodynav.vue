<template>
    <div class="nav-container" :class="{ 'show-nav': isHomePage }">
        <hr class="fen">
        <nav class="nav-content">
            <router-link to="/community" class="custom-router-link">社区/Community</router-link>
            <router-link to="/talking" class="custom-router-link">心语/Talking</router-link>
            <router-link to="/resource" class="custom-router-link">资源/Resource</router-link>
            <router-link to="/news" class="custom-router-link">新闻/News</router-link>
            <div class="test-container">
                <router-link to="/testshow" class="custom-router-link">测试/Test</router-link>
                <div class="test-content">
                    <div class="test-column">
                        <h3>条件/Condition</h3>
                        <div class="test-grid">
                            <router-link 
                                v-for="test in conditionTests"
                                :key="test.type"
                                :to="{ 
                                    path: '/test',
                                    query: { type: test.type }
                                }"
                            >{{ test.title }}</router-link>
                        </div>
                    </div>
                    <div class="test-column">
                        <h3>生活方式/Lifestyle</h3>
                        <div class="test-grid">
                            <router-link 
                                v-for="test in lifestyleTests"
                                :key="test.type"
                                :to="{ 
                                    path: '/test',
                                    query: { type: test.type }
                                }"
                            >{{ test.title }}</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <router-link to="/develop" class="custom-router-link">寻医/Develop</router-link>
        </nav>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

// 定义响应式数据
const conditionTests = ref([])
const lifestyleTests = ref([])

// 获取当前路由对象
const route = useRoute()

// 计算属性：判断是否为主页
const isHomePage = computed(() => route.path === '/')

// 方法：获取测试集
const fetchTestSets = async () => {
    try {
        const response = await axios.get('/api/test/sets')
        const allTests = response.data.data

        // 定义条件类测试和生活方式类测试的类型
        const conditionTypes = ['adhd', 'anxiety', 'autism', 'autism-family', 
            'borderline', 'depression', 'eating', 'narcissism', 'ocd', 'ptsd']
        const lifestyleTypes = ['career', 'emotional', 'lonely', 'personality', 
            'relationship', 'attachment', 'therapy', 'sleep', 'dependent', 'obsessive']

        // 根据type字段过滤分类并限制每类最多10个
        conditionTests.value = allTests
            .filter(test => conditionTypes.includes(test.type))
            .slice(0, 10)
        lifestyleTests.value = allTests
            .filter(test => lifestyleTypes.includes(test.type))
            .slice(0, 10)
    } catch (error) {
        console.error('获取测试集失败:', error)
    }
}

onMounted(fetchTestSets)
</script>

<style scoped>
.nav-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 1000;
}

nav {
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    gap: 4vw;
    width: 100%;
    max-width: 1300px;
    padding: 0 20px;
    align-items: center;
    height: 50px;
    position: relative;
}

.custom-router-link {
    text-decoration: none;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0.5px;
    line-height: 34.75px;
    color: rgba(0, 0, 0, 0.85);
    text-align: left;
    vertical-align: top;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.custom-router-link:hover {
    color: #ff6b6b;
    background-color: rgba(255, 107, 107, 0.08);
}

.custom-router-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #ff6b6b;
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.custom-router-link:hover::after {
    width: 70%;
}

.custom-router-link::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.custom-router-link:hover::before {
    width: 200px;
    height: 200px;
}

.custom-router-link.router-link-active {
    color: #ff6b6b;
    font-weight: 500;
}

.custom-router-link.router-link-active::after {
    width: 70%;
}

.fen {
    width: 90vw;
    max-width: 100%;
    margin: 10px auto;
    height: 4px;
    opacity: 1;
    border: none;
    background: linear-gradient(to right, rgba(229, 229, 229, 0.5), rgba(229, 229, 229, 1), rgba(229, 229, 229, 0.5));
}

.nav-content {
    max-height: none;
    width: 100%;
    min-width: 1500px;
    overflow: visible;
    transition: none;
    position: relative;
    z-index: 100;
    margin-bottom: 10px;
}

.show-nav .nav-content {
    max-height: 200px;
}

.nav-container:hover .nav-content {
    max-height: 200px;
}

.test-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
}

.test-container .custom-router-link {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 8px 16px;
}

.test-content {
    width: 750px;
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 10px;
    background-color: white;
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    border-radius: 16px;
    padding: 20px 30px 40px 40px;
    z-index: 1000;
    border: 1px solid rgba(0,0,0,0.08);
    backdrop-filter: blur(10px);
}

.test-column {
    flex: 1;
}

.test-column h3 {
    color: #2c3e50;
    margin-bottom: 24px;
    font-size: 20px;
    border-bottom: 2px solid #e5e5e5;
    padding-bottom: 12px;
    font-weight: 600;
    position: relative;
}

.test-column h3::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: #ff6b6b;
}

.test-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}

.test-grid a {
    color: #4a4a4a;
    text-decoration: none;
    font-size: 15px;
    transition: all 0.3s ease;
    padding: 10px 14px;
    border-radius: 8px;
    display: block;
}

.test-grid a:hover {
    color: #ff6b6b;
    background-color: rgba(255,107,107,0.08);
    transform: translateX(8px);
    box-shadow: 0 2px 8px rgba(255,107,107,0.1);
}

.test-container::after {
    content: '';
    position: absolute;
    height: 20px;
    width: 100%;
    bottom: -20px;
    left: 0;
}

.test-container:hover .test-content {
    display: flex;
    gap: 40px;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-15px) translateX(-50%);
    }
    to {
        opacity: 1;
        transform: translateY(0) translateX(-50%);
    }
}
</style>
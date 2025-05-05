<template>
    <div class="contain">
        <transition :name="slideDirection">
            <div class="slide-content" :key="currentIndex">
                <div class="content">
                    <div class="text-section">
                        <div class="title-tag">无声对白-心灵智语</div>
                        <h1 class="main-title">{{ slides[currentIndex].title }}</h1>
                        <p class="description">{{ slides[currentIndex].description }}</p>
                        <router-link to="/talking">
                            <div class="start-journey">开启心灵对话之旅</div>
                        </router-link>
                        <div class="nav-dots">
                            <span 
                                v-for="(slide, index) in slides" 
                                :key="index"
                                :class="['dot', { active: currentIndex === index }]"
                                @click="setCurrentSlide(index)"
                            ></span>
                            <div class="nav-arrows">
                                <span class="arrow prev" @click="prevSlide">‹</span>
                                <span class="arrow next" @click="nextSlide">›</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="image-container">
                    <img :src="slides[currentIndex].image" alt="心灵对话" />
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// 导入图片
import lake from '../assets/湖.jpg'
import sunset1 from '../assets/落日1.png'
import sunset2 from '../assets/落日2.png'

const currentIndex = ref(0)
const slideDirection = ref('slide-left')  // 添加滑动方向的ref
let autoSlideTimer = null  // 添加计时器变量

const slides = ref([
    {
        title: "让矛盾在无声中消散",
        description: "谁都不愿意直面给那些给我们带来压力、不满却又确实不得不直面的人，矛盾无法避免，我们如何才能够让二者之间的矛盾，悄无声息的消失呢？",
        image: lake
    },
    {
        title: "扣响心扉走入你的心弦",
        description: "最怕的是那些熟人，最恨的是自己的无能，想要保持乐观就必须将自己的内心诉说，我们为您专属定制虚拟角色，让您畅所欲言而无需有任何心理负担",
        image: sunset1
    },
    {
        title: "轻娱轶事浸润你的心田",
        description: "心理学家研究，在自身情绪即将失控时，转移注意力是一件非常及时且有效缓解自身情绪的一件事，如果心情低落，不妨来看看生活中的奇闻轶事",
        image: sunset2
    }
])

const nextSlide = () => {
    slideDirection.value = 'slide-left'
    currentIndex.value = (currentIndex.value + 1) % slides.value.length
    resetTimer()  // 重置计时器
}

const prevSlide = () => {
    slideDirection.value = 'slide-right'
    currentIndex.value = currentIndex.value === 0 
        ? slides.value.length - 1 
        : currentIndex.value - 1
    resetTimer()  // 重置计时器
}

const setCurrentSlide = (index) => {
    slideDirection.value = index > currentIndex.value ? 'slide-left' : 'slide-right'
    currentIndex.value = index
    resetTimer()  // 重置计时器
}

// 添加重置计时器的函数
const resetTimer = () => {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer)
    }
    autoSlideTimer = setInterval(nextSlide, 5000)
}

onMounted(() => {
    autoSlideTimer = setInterval(nextSlide, 5000)
})

// 添加组件卸载时的清理
onUnmounted(() => {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer)
    }
})
</script>

<style scoped>
.contain {
    padding: 0 40px;
    width: 100%;
    height: 74vh;
    background: linear-gradient(90deg, #fff5f8 0%, #fff8f9 50%, #fffbf2 100%);
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    box-sizing: border-box;
}
.content {
    margin: 40px;
    flex: 0.8;
    padding-left: 3vw;
}
.slide-content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    left: 0;
    right: 0;
}

.text-section {
    max-width: 600px;
}

.title-tag {
    color: #B02C39;
    font-size: 18px;
    margin-bottom: 30px;
    position: relative;
    padding-left: 15px;
}

.title-tag::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background-color: #B02C39;
}

.main-title {
    font-size: 48px;
    font-weight: bold;
    line-height: 1.4;
    margin-bottom: 30px;
    color: #333;
}

.description {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    margin-bottom: 40px;
    max-width: 100%;
}

.start-journey {
    display: inline-block;
    padding: 15px 35px;
    color: rgb(0, 0, 0);
    border-radius: 50px;
    border: solid 1px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 50px;
}

.start-journey:hover {
    color: rgb(255, 255, 255);
    background-color: rgba(51, 21, 122, 1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(51, 21, 122, 0.2);
}

.image-container {
    flex: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 40px;
}

.image-container img {
    width: 100%;
    height: 75%;
    object-fit: cover;
    border-radius: 20px;
    margin: 20px;
}

.nav-dots {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 207, 212, 1);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot.active {
    background-color: rgba(250, 52, 72, 1);
    transform: scale(1.2);
}

.nav-arrows {
    margin-left: 30px;
    display: flex;
    gap: 10px;
}

.arrow {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 36px;
    text-align: center;
    background-color: #4a154b;
    color: white;
    border-radius: 50%;
    margin: 0 5px;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.3s ease;
}

.arrow:hover {
    background-color: #4a1f99;
    transform: translateY(-2px);
}

.arrow.prev {
    margin-right: 10px;
}

.image-container img {
    transition: all 0.5s ease;
}

.main-title,
.description {
    transition: all 0.3s ease;
}

/* 添加以下过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 向左滑动的动画 */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.5s ease-in-out;
}

.slide-left-enter-from {
    transform: translateX(100%);
}

.slide-left-leave-to {
    transform: translateX(-100%);
}

/* 向右滑动的动画 */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.5s ease-in-out;
}

.slide-right-enter-from {
    transform: translateX(-100%);
}

.slide-right-leave-to {
    transform: translateX(100%);
}
</style>
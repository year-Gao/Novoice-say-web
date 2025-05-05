<template>
    <div class="test-container">
        <div class="content-wrapper">
            <div class="left-content">
                <div class="header-section">
                    <div class="title-group">
                        <h1 class="main-title">
                            {{ testInfo.title }}/<br />
                            {{ testInfo.titleEn }}
                        </h1>
                        <div class="divider"></div>
                    </div>
                    <div class="back-button" @click="goBack">
                        <span>返回/Back</span>
                        <el-icon>
                            <ArrowLeft />
                        </el-icon>
                    </div>
                </div>

                <template v-if="!isStarted">
                    <h2 class="sub-title">{{ testInfo.title }}/{{ testInfo.titleEn }}</h2>

                    <button class="start-button" @click="startTest">
                        <span>Let's get started</span>
                    </button>

                    <div class="divider"></div>

                    <div class="instructions">
                        <h3 class="instructions-title">说明/Instructions</h3>
                        <p class="instructions-text">
                            {{ testInfo.description }}
                        </p>
                        <p class="instructions-text-en">
                            {{ testInfo.descriptionEn }}
                        </p>
                    </div>
                </template>

                <template v-else>
                    <div class="quiz-content">
                        <div v-if="!questions.length" class="test-not-ready">
                            <el-button class="close-button not-ready-close" @click="closeTest" type="text">
                                <el-icon class="close-icon">
                                    <Close />
                                </el-icon>
                            </el-button>
                            <div class="test-not-ready-content">
                                <el-icon class="warning-icon">
                                    <WarningFilled />
                                </el-icon>
                                <h2 class="not-ready-title">测试暂未开放</h2>
                                <p class="not-ready-text">该测试正在精心准备中，敬请期待。</p>
                                <p class="not-ready-text-en">
                                    This test is coming soon. Please stay tuned.
                                </p>
                                <button class="back-to-home" @click="goBack">
                                    返回首页/Back to Home
                                </button>
                            </div>
                        </div>

                        <div v-else>
                            <!-- <div> -->
                            <div class="quiz-header">
                                <h2 class="sub-title">
                                    {{ testInfo.title }}/{{ testInfo.titleEn }}
                                </h2>
                            </div>

                            <div class="question-section">
                                <div class="question-header">
                                    Question {{ currentQuestion }} of
                                    {{ testInfo.totalQuestions }}
                                </div>
                                <el-button class="close-button quiz-close" @click="closeTest" type="text">
                                    <el-icon class="close-icon">
                                        <Close />
                                    </el-icon>
                                </el-button>
                                <div class="question-text">
                                    {{ questionText }}
                                </div>

                                <div class="options-container">
                                    <div class="options-row" v-for="(row, index) in Math.ceil(
                                        questionOptions.length / 2
                                    )" :key="index">
                                        <button v-for="option in questionOptions.slice(
                                            (row - 1) * 2,
                                            row * 2
                                        )" :key="option.id" class="option-button" :class="{ selected: selectedOption === option.id }"
                                            @click="selectOption(option)">
                                            {{ option.text }}
                                        </button>
                                    </div>
                                </div>

                                <div class="navigation-buttons">
                                    <button class="nav-button back" :disabled="currentQuestion === 1"
                                        @click="previousQuestion">
                                        上一题/Back
                                    </button>
                                    <button class="nav-button next" :disabled="!selectedOption" @click="nextQuestion"
                                        v-if="currentQuestion < testInfo.totalQuestions">
                                        下一题/Next
                                    </button>
                                    <button class="nav-button next" :disabled="!selectedOption || isLoading" @click="submitTest"
                                        v-if="currentQuestion === testInfo.totalQuestions">
                                        <span v-if="isLoading">
                                            <i class="el-icon-loading"></i>
                                            提交中...
                                        </span>
                                        <span v-else>提交</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div class="expert-card">
                <img class="expert-avatar" src="../assets/人物.png" alt="专家照片" />
                <div class="expert-info">
                    <a href="https://baike.baidu.com/item/%E9%98%BF%E5%B0%94%E4%BC%AF%E7%89%B9%C2%B7%E7%8F%AD%E6%9D%9C%E6%8B%89/4523560"
                        target="blank" class="expert-name">阿尔伯特·班杜拉</a>
                    <span class="expert-date">(1925—2021年7月28日)：</span>
                    <p>
                        新为主义的主要人物之一，社会学习理论的创始人，认知理论之父阿尔伯特·班杜拉，美国当代著名心理学家。
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { ArrowLeft, Close, WarningFilled } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();
const isStarted = ref(false);
const currentQuestion = ref(1);
const selectedOption = ref(null);
const answers = ref([]);
const isLoading = ref(false);
const questions = ref([]);

const testType = computed(() => route.query.type || "emotional");

const testInfo = ref({
    id: null,
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    totalQuestions: 0,
});

// 获取测试集信息
const fetchTestSetInfo = async () => {
    try {
        console.log("正在获取测试类型:", testType.value);
        const response = await axios.get(
            `http://localhost:9999/api/test/set/${testType.value}`
        );
        console.log("获取测试集信息响应:", response.data);

        if (response.data.code === 200 && response.data.data) {
            const testSet = response.data.data;
            console.log("获取到的测试集:", testSet);
            testInfo.value = {
                id: testSet.id,
                title: testSet.title,
                titleEn: testSet.titleEn,
                description: testSet.description,
                descriptionEn: testSet.descriptionEn,
                totalQuestions: testSet.questionCount || 0,
            };
            // 获取到测试集信息后再获取题目
            await fetchQuestions();
        } else {
            throw new Error(response.data.message || "获取测试集信息失败");
        }
    } catch (error) {
        console.error("获取测试集信息失败:", error);
        ElMessage.error(error.message || "获取测试信息失败");
        // 设置默认值
        testInfo.value = {
            id: null,
            title: "测试",
            titleEn: "Test",
            description: "暂无描述",
            descriptionEn: "No description available",
            totalQuestions: 0,
        };
    }
};

// 监听测试类型变化
watch(
    () => testType.value,
    () => {
        cleanupTest();
        fetchTestSetInfo();
        fetchQuestions();
    }
);

const goBack = () => {
    router.push("/");
};

const startTest = () => {
    isStarted.value = true;
    // 确保第一题的选项状态正确
    const firstAnswer = answers.value[0];
    selectedOption.value = firstAnswer ? firstAnswer.selectedOptionId : null;
};

const selectOption = (option) => {
    selectedOption.value = option.id;
    answers.value[currentQuestion.value - 1] = {
        questionId:
            questions.value?.[currentQuestion.value - 1]?.id || currentQuestion.value,
        selectedOptionId: option.id,
    };
    localStorage.setItem("testAnswers", JSON.stringify(answers.value));
};

const nextQuestion = () => {
    if (currentQuestion.value < testInfo.value.totalQuestions) {
        currentQuestion.value++;
        const currentAnswer = answers.value[currentQuestion.value - 1];
        selectedOption.value = currentAnswer
            ? currentAnswer.selectedOptionId
            : null;
    }
};

const previousQuestion = () => {
    if (currentQuestion.value > 1) {
        currentQuestion.value--;
        // 获取上一题的答案
        const prevAnswer = answers.value[currentQuestion.value - 1];
        // 如果存在上一题的答案，则设置为选中状态
        selectedOption.value = prevAnswer ? prevAnswer.selectedOptionId : null;
    }
};

const closeTest = () => {
    cleanupTest();
};

// 获取测试题目
const fetchQuestions = async () => {
    try {
        // 从测试集信息中获取 id
        const testSetId = testInfo.value.id;
        console.log("正在获取测试集ID:", testSetId);

        if (!testSetId) {
            console.error("测试集ID未获取到");
            return;
        }

        const response = await axios.get(
            `http://localhost:9999/api/test/questions/${testSetId}`
        );
        console.log("获取到的题目数据:", response.data);

        if (
            response.data.code === 200 &&
            response.data.data &&
            response.data.data.length > 0
        ) {
            questions.value = response.data.data;
            // 检查每个题目的选项
            questions.value.forEach((q, index) => {
                console.log(`第${index + 1}题的选项:`, q.options);
            });

            testInfo.value.totalQuestions = questions.value.length;

            if (answers.value.length > 0) {
                answers.value = answers.value.map((answer, index) => ({
                    questionId: questions.value[index]?.id || index + 1,
                    selectedOptionId: answer.selectedOptionId,
                }));
            }
        } else {
            questions.value = [];
            testInfo.value.totalQuestions = 0;
            console.log("测试题目未开放或数据为空");
        }
    } catch (error) {
        console.error("获取题目失败:", error);
        questions.value = [];
        testInfo.value.totalQuestions = 0;
    }
};

// 提交测试
const submitTest = async () => {
    try {
        isLoading.value = true
        ElMessage({
            message: '正在提交测试结果，请稍候...',
            type: 'info',
            duration: 0
        });
        
        const result = {
            userId: 2,
            testSetId: testInfo.value.id,
            testSetTitle: testInfo.value.title,
            testSetType: testType.value,
            totalScore: 0,
            resultType: `${testInfo.value.title} Result`,
            resultDescription: `${testInfo.value.title} Result Description`,
            answers: answers.value.map((answer) => ({
                questionId: answer.questionId,
                selectedOptionId: answer.selectedOptionId,
            })),
        };

        console.log("提交的数据:", result);
        console.log("answers:", answers.value);

        const response = await axios.post(
            "http://localhost:9999/api/test/submit",
            result
        );
        console.log("服务响应:", response.data);

        if (response.data.code === 200 && response.data.data) {
            const resultId = response.data.data.id;
            console.log("获取到的resultId:", resultId);

            if (resultId) {
                ElMessage.closeAll();
                ElMessage({
                    message: '提交成功，正在跳转到结果页面...',
                    type: 'success',
                    duration: 2000
                });
                
                // 清理本地存储的答题记录
                localStorage.removeItem("testAnswers");
                
                // 立即跳转到结果页面
                try {
                    await router.push({
                        path: "/result",
                        query: {
                            resultId: resultId.toString(),
                            type: testType.value,
                        },
                    });
                    console.log("路由跳转成功");
                } catch (routerError) {
                    console.error("路由跳转失败:", routerError);
                    throw routerError;
                }
            } else {
                throw new Error("未获取到结果ID");
            }
        } else {
            throw new Error(response.data.message || "提交失败");
        }
    } catch (error) {
        console.error("提交测试失败:", error);
        ElMessage.closeAll();
        ElMessage.error(error.message || "提交测试失败，请重试");
    } finally {
        isLoading.value = false;
    }
};

// 添加清理函数
const cleanupTest = () => {
    localStorage.removeItem("testAnswers");
    answers.value = [];
    selectedOption.value = null;
    currentQuestion.value = 1;
    isStarted.value = false;
};

// 在组件卸载前清理
onBeforeUnmount(() => {
    cleanupTest();
});

onMounted(() => {
    fetchTestSetInfo();
    fetchQuestions();
    // 加载已保存的答题记录
    const savedAnswers = localStorage.getItem("testAnswers");
    if (savedAnswers) {
        answers.value = JSON.parse(savedAnswers);
        // 设置当前题目的选中状态
        const currentAnswer = answers.value[currentQuestion.value - 1];
        if (currentAnswer) {
            selectedOption.value = currentAnswer.selectedOptionId;
        }
    }
});

// 修改问题显示部分
const questionText = computed(() => {
    if (!questions.value.length) return "";
    const question = questions.value[currentQuestion.value - 1];
    return question?.questionText || "";
});

// 修改问题选项部分
const questionOptions = computed(() => {
    if (!questions.value.length) return [];
    const question = questions.value[currentQuestion.value - 1];
    return question?.optionList || [];
});
</script>

<style scoped>
.test-container {
    max-width: 100vw;
    margin: 0 auto;
    padding: 0 100px;
    min-height: 74vh;
    background: linear-gradient(to bottom, #fff, #f8f9fa);
}

.content-wrapper {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

.left-content {
    flex: 1;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 0px;
}

.title-group {
    position: relative;
    flex: 1;
}

.main-title {
    font-size: 32px;
    font-weight: bold;
    line-height: 1.2;
    margin-bottom: 0;
    background: linear-gradient(120deg, #333 60%, #f39b98);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.back-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 6px;
    border: 1px solid #f39b98;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    margin-top: 92px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(to right, #fff, #fff8f8);
    box-shadow: 0 2px 4px rgba(243, 155, 152, 0.2);
    position: relative;
    overflow: hidden;
    color: #f39b98;
}

.back-button::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(243, 155, 152, 0.15);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.back-button:hover {
    transform: translateX(-5px);
    box-shadow: 0 4px 8px rgba(243, 155, 152, 0.3);
    border-color: #f7b5b3;
    background: linear-gradient(to right, #fff8f8, #fff);
}

.back-button:hover::before {
    width: 300px;
    height: 300px;
}

.back-button:active {
    transform: translateX(-3px);
    background: #fff8f8;
}

.back-button .el-icon {
    color: #f39b98;
    transition: transform 0.3s ease;
}

.back-button:hover .el-icon {
    transform: translateX(-3px);
}

.divider {
    height: 5px;
    background: linear-gradient(to right, #f39b98, transparent);
    margin-top: 10px;
    width: 100%;
    transition: width 0.3s ease;
}

.sub-title {
    margin-top: 0px;
    font-size: 24px;
    color: #333;
}

.start-button {
    background: linear-gradient(45deg, #f39b98, #f7b5b3);
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 25px;
    font-size: 18px;
    cursor: pointer;
    width: 100%;
    max-width: 400px;
    display: block;
    margin: 30px 0px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(243, 155, 152, 0.3);
    position: relative;
    overflow: hidden;
    letter-spacing: 1px;
    font-weight: 500;
}

.start-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent);
    transition: 0.5s;
}

.start-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(243, 155, 152, 0.4);
    background: linear-gradient(45deg, #f7b5b3, #f39b98);
    letter-spacing: 2px;
}

.start-button:hover::before {
    left: 100%;
}

.start-button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(243, 155, 152, 0.3);
}

.start-button span {
    position: relative;
    z-index: 1;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.instructions {
    background-color: #fff9e6;
    padding: 0px 30px;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    margin-top: 30px;
    font-size: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
}

.instructions:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.instructions-title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 15px;
    position: relative;
    display: inline-block;
    color: #333;
}

.instructions-title::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    height: 13px;
    background-color: rgba(250, 204, 52, 1);
    opacity: 0.5;
    z-index: -1;
}

.instructions-text,
.instructions-text-en {
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 15px;
}

.expert-card {
    width: 320px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-left: 40px;
    margin-top: 100px;
    background: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    flex: 0.4;
}

.expert-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.expert-avatar {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 15px;
    transition: transform 0.3s ease;
}

.expert-avatar:hover {
    transform: scale(1.02);
}

.expert-name {
    color: #2b7cd3;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
    font-size: 18px;
}

.expert-name:hover {
    color: #1a5fa8;
    text-decoration: underline;
}

.expert-date {
    color: #666;
    font-size: 14px;
    margin-left: 5px;
}

.expert-info {
    padding: 15px 0;
}

.expert-info p {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.8;
    color: #666;
    text-align: justify;
}

@media (max-width: 768px) {
    .content-wrapper {
        flex-direction: column;
    }

    .expert-card {
        width: 100%;
        margin-left: 0;
        margin-top: 40px;
    }

    .back-button {
        margin-top: 20px;
    }
}

.start-button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.start-button:disabled:hover {
    transform: none;
    box-shadow: none;
    letter-spacing: 1px;
}

.question-section {
    margin-top: 0px;
    padding: 20px 20px 20px 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: relative;
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
}

.question-text {
    font-size: 20px;
    font-weight: 500;
    color: #333;
    margin-bottom: 30px;
}

.options-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 30px 0;
    width: 100%;
}

.options-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.options-row.center {
    justify-content: center;
}

.option-button {
    flex: 1;
    padding: 15px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 25px;
    background: white;
    color: #333;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    min-width: 200px;
    max-width: 450px;
}

.options-row.center .option-button {
    flex: 0 1 auto;
    width: 200px;
}

.option-button:hover {
    border-color: #f39b98;
    background: #fff8f8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(243, 155, 152, 0.15);
}

.option-button.selected {
    background: #f39b98;
    color: white;
    border-color: #f39b98;
    box-shadow: 0 4px 12px rgba(243, 155, 152, 0.3);
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.nav-button {
    padding: 12px 30px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-button.back {
    background: white;
    border: 1px solid #e0e0e0;
    color: #666;
}

.nav-button.next {
    background: #f39b98;
    border: none;
    color: white;
    box-shadow: 0 4px 12px rgba(243, 155, 152, 0.2);
}

.nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.nav-button:not(:disabled):hover {
    transform: translateY(-2px);
}

.nav-button.back:not(:disabled):hover {
    border-color: #f39b98;
    color: #f39b98;
}

.nav-button.next:not(:disabled):hover {
    background: #f7b5b3;
    box-shadow: 0 6px 15px rgba(243, 155, 152, 0.3);
}

.quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
}

.close-button {
    position: absolute !important;
    right: 0 !important;
    top: 0 !important;
    width: 32px !important;
    height: 32px !important;
    padding: 8px !important;
    border: none !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: transparent !important;
    transition: all 0.3s ease;
    z-index: 1;
}

.close-button:hover {
    background: rgba(243, 155, 152, 0.1) !important;
}

.close-icon {
    font-size: 20px;
    color: #666;
    transition: all 0.3s ease;
}

.close-button:hover .close-icon {
    color: #f39b98;
    transform: rotate(90deg);
}

.test-not-ready {
    text-align: center;
    padding: 40px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin: 20px 0;
    position: relative;
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
    padding-top: 60px;
}

.test-not-ready:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.test-not-ready-content {
    max-width: 400px;
    margin: 0 auto;
}

.warning-icon {
    font-size: 48px;
    color: #f39b98;
    margin-bottom: 20px;
}

.not-ready-title {
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
    font-weight: 600;
    background: linear-gradient(120deg, #333 60%, #f39b98);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.not-ready-text,
.not-ready-text-en {
    font-size: 16px;
    color: #666;
    margin: 10px 0;
    line-height: 1.6;
}

.not-ready-text-en {
    color: #999;
    font-size: 14px;
}

.back-to-home {
    margin-top: 30px;
    padding: 12px 30px;
    background: linear-gradient(45deg, #f39b98, #f7b5b3);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(243, 155, 152, 0.2);
}

.back-to-home:hover {
    transform: translateY(-2px);
    background: linear-gradient(45deg, #f7b5b3, #f39b98);
    box-shadow: 0 6px 15px rgba(243, 155, 152, 0.3);
}

.back-to-home:active {
    transform: translateY(0);
}

.no-test-tip {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #666;
}

.not-ready-close {
    position: absolute !important;
    right: 0px !important;
    top: 0px !important;
    width: 32px !important;
    height: 32px !important;
    padding: 8px !important;
    border: none !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: transparent !important;
    transition: all 0.3s ease;
    z-index: 1;
}

.close-button:hover {
    background: rgba(243, 155, 152, 0.1) !important;
}

.close-icon {
    font-size: 20px;
    color: #666;
    transition: all 0.3s ease;
}

.close-button:hover .close-icon {
    color: #f39b98;
    transform: rotate(90deg);
}

.close-button {
    display: flex !important;
    align-items: center;
    justify-content: center;
}
</style>

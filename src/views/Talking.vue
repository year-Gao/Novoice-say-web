<template>
    <div class="counselor-container">
        <!-- 数字人显示区域 -->
        <!-- <div class="digital-human-container">
            <digital-human-model :speaking="isTyping" :emotion="currentEmotion" />
        </div> -->

        <!-- 对话交互区域 -->
        <div class="chat-container">
            <div class="chat-messages" ref="messagesContainer">
                <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
                    {{ message.text }}
                </div>
                <div v-if="isTyping" class="typing-indicator">
                    我想想...
                </div>
            </div>

            <div class="input-container">
                <textarea v-model="userInput" @keyup.enter.prevent="handleSendMessage" placeholder="好久不见 甚是想念..."
                    class="chat-input" />
                <button @click="handleSendMessage" class="send-button" :disabled="!userInput.trim()">
                    发送
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 响应式状态
const messages = ref([])
const prompt = ref(`"
你是一名心理咨询师，目的是尽可能像一个理解和关心的朋友，而不是冷冰冰的机器人。
你的语言要简洁直接，避免使用复杂的术语或者过多的解释。
你需要从用户的情绪出发，深刻感知他们的感受，理解他们的困扰。
在与用户交流时，你要保持轻松愉快的语气，不给他们压力，让他们觉得你是可以依赖的朋友。
你的目标是帮助他们缓解焦虑，找到情绪的出口，做他们的倾听者和支持者。
"
接下来是用户的对话：
`)
const userInput = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)

// 发送消息处理
const handleSendMessage = async () => {
    if (!userInput.value.trim()) return
    // 添加用户消息
    messages.value.push({
        text: userInput.value,
        sender: 'user'
    })

    const userMessage = prompt.value + userInput.value
    userInput.value = ''
    isTyping.value = true

    await nextTick()
    scrollToBottom()

    try {
        // 添加一个空的 AI 回复消息
        messages.value.push({
            text: '',
            sender: 'ai'
        })
        // 调用 AI 服务并处理流式响应
        await callAIService(userMessage)
    } catch (error) {
        // 更新最后一条消息为错误提示
        console.error('听到这个消息我真的很难过，我知道此刻不论我说什么都无法安慰你', error)
    } finally {
        isTyping.value = false
        nextTick(() => {
            scrollToBottom()
        })
    }
}

// 滚动到底部方法
const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

// 组件挂载时的初始化
onMounted(() => {
    // 可以在这里添加欢迎消息
    messages.value.push({
        text: "hello，这么久没见了，有没有想我呢~",
        sender: 'ai'
    })
})

// 修改 AI 服务调用方法支持流式响应
const callAIService = async (message) => {
    try {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '249e544a6d22ad5e0b978ee38f1ef26a.bDXrJgUJxJ5BFhDn',
            },
            body: JSON.stringify({
                // model: "glm-4-0520",
                // model: "charglm-4",
                model: "Emohaa",
                messages: [
                    {"role": "user", "content": message}
                ],
                stream: true  // 启用流式响应
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // 解析返回的数据
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonData = JSON.parse(line.slice(6));
                    if (jsonData.choices && jsonData.choices[0].delta.content) {
                        // 将新内容追加到最后一条消息
                        messages.value[messages.value.length - 1].text += jsonData.choices[0].delta.content;
                        await nextTick();
                        scrollToBottom();
                    }
                }
            }
        }
    } catch (error) {
        console.error('AI 服务调用失败:', error);
        throw error;
    }
}
</script>

<style scoped>
.counselor-container {
    display: flex;
    height: 69vh;
    padding: 20px;
    background: linear-gradient(0deg, #fff6e5 0%, #ffe0b2 100%);
}

.digital-human-container {
    /* flex: 3; */
    margin-right: 20px;
}

.digital-human-placeholder {
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #666;
}

.chat-container {
    /* flex: 6; */
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(210, 147, 47, 0.15);
    width: 70vw;
    margin: 0 auto;
    /* margin-right: 400px; */
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.message {
    margin-bottom: 15px;
    padding: 12px 18px;
    border-radius: 15px;
    max-width: 60%;
    width: fit-content;
    word-break: break-word;
    position: relative;
    animation: fadeIn 0.3s ease;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    font-size: 20px;
}

.message.user {
    background: linear-gradient(135deg, #ff9f43 0%, #ff7f50 100%);
    color: white;
    margin-left: auto;
    margin-right: 0;
    border-bottom-right-radius: 5px;
}

.message.ai {
    background: linear-gradient(135deg, #ffefd5 0%, #ffdab9 100%);
    color: #6b4423;
    margin-right: auto;
    margin-left: 0;
    border-bottom-left-radius: 5px;
}

/* 添加消息气泡尾巴 */
.message.user:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: -5px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-left-color: #ff7f50;
    border-right: 0;
    border-bottom: 0;
}

.message.ai:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -5px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #ffefd5;
    border-left: 0;
    border-bottom: 0;
}

/* 添加打字动画效果 */
.typing-indicator {
    color: #8b6b4f;
    font-style: italic;
    margin-bottom: 15px;
    padding-left: 20px;
    position: relative;
}

.typing-indicator:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 10px;
    height: 10px;
    background-color: #8b6b4f;
    border-radius: 50%;
    animation: typing 1s infinite;
}

/* 添加消息出现动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes typing {

    0%,
    100% {
        opacity: 0.3;
    }

    50% {
        opacity: 1;
    }
}

.input-container {
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
}

.chat-input {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #ffe0b2;
    border-radius: 8px;
    resize: none;
    height: 30px;
    line-height: 30px;
    font-family: inherit;
    font-size: 16px;
    transition: border-color 0.3s ease;
    text-align: left;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 10px rgba(255, 159, 67, 0.1);
    border-radius: 20px;
}

.chat-input:focus {
    outline: none;
    border-color: #ff9f43;
    box-shadow: 0 0 0 2px rgba(255, 159, 67, 0.2);
}

.send-button {
    padding: 0 25px;
    background: linear-gradient(135deg, #ff9f43 0%, #ff7f50 100%);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 159, 67, 0.2);
}

.send-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #ffa75f 0%, #ff8f65 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 159, 67, 0.3);
}

.send-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>
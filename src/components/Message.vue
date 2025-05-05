<template>
  <transition name="message-fade">
    <div v-if="visible" class="message" :class="type">
      {{ content }}
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const content = ref('')
const type = ref('success')

const show = (text, messageType = 'success', duration = 2000) => {
  content.value = text
  type.value = messageType
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 9999;
  color: white;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.success {
  background-color: #67c23a;
}

.error {
  background-color: #f56c6c;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 
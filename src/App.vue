<script setup>
import Bodynav from './components/bodynav.vue';
import Headnav from './components/headnav.vue';
import Message from './components/Message.vue';
import { ref, provide } from 'vue';

const messageRef = ref(null);

// 提供全局消息方法
provide('message', {
  show: (text, type, duration) => {
    messageRef.value?.show(text, type, duration);
  }
});
</script>

<template>
  <div>
    <Message ref="messageRef"/>
    <Headnav/>
    <Bodynav/>
    <router-view></router-view>
  </div>
</template>

<style>
body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.router-view {
    flex: 1;
    padding-top: 20px;
}
</style>
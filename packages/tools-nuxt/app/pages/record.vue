<script setup lang="ts">
definePageMeta({ layout: false })

type Status = 'idle' | 'recording' | 'processing'

const status = ref<Status>('idle')
const { result, finished, start, stop } = useSpeechRecognition()

if (import.meta.client) {
  electron.asr.onCommand((cmd) => {
    if (cmd === 'start') {
      status.value = 'recording'
      start()
    }
    else if (cmd === 'stop') {
      stop()
      status.value = 'processing'
    }
  })

  watch(finished, () => {
    if (result.value)
      electron.asr.sendResult(result.value)
    status.value = 'idle'
    electron.asr.hide()
  })
}
</script>

<template>
  <div class="record-overlay">
    <div v-if="status === 'recording'" class="pill">
      <span class="dot" />
      <span class="label">录音中</span>
    </div>
    <div v-else-if="status === 'processing'" class="pill">
      <span class="dot" />
      <span class="label">识别中</span>
    </div>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  background: transparent !important;
}
</style>

<style scoped>
.record-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  -webkit-app-region: no-drag;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 1s ease-in-out infinite;
}

.pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 28px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}
</style>

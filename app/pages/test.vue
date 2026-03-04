<script setup lang="ts">
const recorder = new AudioRecorder()
const isRecording = ref(false)
const audioUrl = ref<string | null>(null)

const base64 = ref<string | null>(null)

async function handleStart() {
  await recorder.start()
  isRecording.value = true
}

async function handleStop() {
  const blob = await recorder.stop()
  if (blob) {
    audioUrl.value = URL.createObjectURL(blob)
    base64.value = await blobToBase64(blob)
  }
  isRecording.value = false
}

async function submit() {
  const { body } = await $fetch('/api/recognize', {
    method: 'post',
    body: { data: base64.value },
  })
}

onBeforeMount(async () => {
  if (isRecording.value) {
    await recorder.stop()
  }
})
</script>

<template>
  <div>
    <UButton to="/">
      返回首页
    </UButton>
    <UButton class="cursor-pointer" :disabled="isRecording" @click="handleStart">
      开始录音
    </UButton>

    <UButton class="cursor-pointer" :disabled="!isRecording" @click="handleStop">
      停止录音
    </UButton>
    <audio v-if="audioUrl" :src="audioUrl" controls />

    <p>{{ base64 }}</p>
    <UButton @click="submit">
      测试
    </UButton>
  </div>
</template>

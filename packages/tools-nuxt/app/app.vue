<script setup lang="ts">
import { useClipboard, useMagicKeys } from '@vueuse/core'

const { add, update, remove } = useSpeechRecognitionToast()
const { result, start, stop } = useSpeechRecognition()

const { copy } = useClipboard()
watch(result, (result) => {
  copy(result)
  update(result)
  setTimeout(() => {
    remove()
  }, 1000)
})

const { space } = useMagicKeys()
let timer: ReturnType<typeof setTimeout> | null = null
watch(() => space?.value, (pressed) => {
  if (pressed) {
    timer = setTimeout(() => {
      start()
      add()
    }, 200)
  }
  else {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    stop()
    update('识别中...')
  }
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'

const { space } = useMagicKeys()

watch(() => space?.value, (pressed) => {
  if (pressed) {
    console.log('空格键被按下')
  }
  else {
    console.log('空格键抬起')
  }
})
</script>

<template>
  <div class="text-center pt-10">
    <p>
      录音器页面
    </p>
    <UButton to="/">
      返回首页
    </UButton>
  </div>
</template>

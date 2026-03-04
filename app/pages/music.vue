<script setup lang="ts">
async function openLyricWindow() {
  await window.electronAPI.showLyricWindow()
}
</script>

<template>
  <div class="text-center pt-10">
    <UButton to="/">
      返回首页
    </UButton>
    <UButton class="cursor-pointer" @click="openLyricWindow">
      桌面歌词
    </UButton>
  </div>
</template>

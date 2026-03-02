<script setup lang="ts">
async function openLyricWindow() {
  if (window.electronAPI) {
    await window.electronAPI.showLyricWindow()
  }
}
</script>

<template>
  <div class="text-center pt-10">
    <h1>音乐页面</h1>
    <NuxtLink to="/">
      返回首页
    </NuxtLink>
  </div>
  <div class="text-center pt-10">
    <button @click="openLyricWindow">
      打开桌面歌词
    </button>
  </div>
</template>

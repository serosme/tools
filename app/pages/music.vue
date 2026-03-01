<script setup lang="ts">
const version = ref('')

onMounted(async () => {
  try {
    if (window.electronAPI) {
      version.value = await window.electronAPI.getVersion()
    }
  }
  catch {
    version.value = '调用失败'
  }
})
</script>

<template>
  <div class="text-center mt-10">
    <h1>Nuxt + Electron 预加载最小示例</h1>
    <p>Electron 版本：{{ version }}</p>
  </div>
  <div class="text-center mt-10">
    <h1>音乐页面</h1>
    <NuxtLink to="/">
      返回首页
    </NuxtLink>
  </div>
</template>

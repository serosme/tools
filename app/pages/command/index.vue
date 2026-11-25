<script setup lang="ts">
useHead({ title: 'Command' })

const { searchTerm, paletteKey, groups, resetPalette, resultLimit } = useCommand()

// ESC 逐级收起：先清空搜索，再退回上一级，最后隐藏窗口
function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape')
    return

  if (searchTerm.value) {
    searchTerm.value = ''
    return
  }

  // 组件内部的二级 history 不对外暴露，返回按钮只在二级时渲染
  const back = document.querySelector<HTMLElement>('[data-slot="back"]')
  if (back) {
    back.click()
    return
  }

  resetPalette()
  window.electronAPI.hideWindow()
}

onMounted(() => window.addEventListener('keydown', onEscape))
onUnmounted(() => window.removeEventListener('keydown', onEscape))
</script>

<template>
  <UCommandPalette
    :key="paletteKey"
    v-model:search-term="searchTerm"
    :groups="groups"
    preserve-group-order
    :fuse="{
      resultLimit,
      matchAllWhenSearchEmpty: false,
      fuseOptions: {
        keys: ['label', 'suffix', 'keywords'],
      },
    }"
    @update:model-value="resetPalette"
  />

  <div class="fixed inset-0 z-10" />
</template>

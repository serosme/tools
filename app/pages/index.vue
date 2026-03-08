<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { watch } from 'vue'

const { space } = useMagicKeys()

watch(space, (pressed) => {
  if (pressed) {
    console.log('空格键被按下')
  }
  else {
    console.log('空格键抬起')
  }
})

const searchTerm = ref('')

// Pages
const pages = [
  {
    label: 'Music',
    icon: 'i-lucide-globe',
    onSelect() { navigateTo('/music') },
  },
  {
    label: 'Test',
    icon: 'i-lucide-globe',
    onSelect() { navigateTo('/test') },
  },
]

// Applications
const appItems = ref<any[]>([])
window.electronAPI.getApplications().then((apps) => {
  appItems.value = apps.map(app => ({
    label: app.name,
    icon: 'i-lucide-app-window',
    onSelect() { window.electronAPI.launchApplication(app.appId) },
  }))
})

// 分组数组
const groups = computed(() => [
  {
    id: 'pages',
    label: 'Pages',
    items: pages,
  },
  {
    id: 'applications',
    label: 'Applications',
    items: appItems.value,
  },
])

onMounted(() => {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      searchTerm.value = ''
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', () => {})
})
</script>

<template>
  <UCommandPalette
    v-model:search-term="searchTerm"
    :groups="groups"
    :fuse="{
      resultLimit: 7,
      matchAllWhenSearchEmpty: false,
    }"
    :autofocus="false"
  />
</template>

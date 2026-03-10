<script setup lang="ts">
const searchTerm = ref('')

// Pages
const pages = [
  {
    label: 'Music',
    icon: 'i-lucide-globe',
    onSelect: selectAndClear(() => navigateTo('/music')),
  },
  {
    label: 'Test',
    icon: 'i-lucide-globe',
    onSelect: selectAndClear(() => navigateTo('/test')),
  },
  {
    label: 'Recorder',
    icon: 'i-lucide-globe',
    onSelect: selectAndClear(() => navigateTo('/recorder')),
  },
]

// Applications
const appItems = ref<any[]>([])
window.electronAPI.getApplications().then((apps) => {
  appItems.value = apps.map(app => ({
    label: app.name,
    icon: 'i-lucide-app-window',
    onSelect: selectAndClear(() =>
      window.electronAPI.launchApplication(app.appId),
    ),
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

function selectAndClear(fn: () => void) {
  return () => {
    searchTerm.value = ''
    fn()
  }
}
</script>

<template>
  <div class="bg-white">
    <UCommandPalette
      v-model:search-term="searchTerm"
      :groups="groups"
      :fuse="{
        resultLimit: 7,
        matchAllWhenSearchEmpty: false,
      }"
      class="border-2 border-red-500"
    />
  </div>
</template>

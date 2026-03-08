<script setup lang="ts">
const searchTerm = ref('')

const defaultGroups = [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      {
        label: 'Music',
        icon: 'i-lucide-globe',
        onSelect() {
          navigateTo('/music')
        },
        featured: true,
      },
      {
        label: 'Test',
        icon: 'i-lucide-globe',
        onSelect() {
          navigateTo('/test')
        },
        featured: true,
      },
    ],
  },
]

const groups = ref([...defaultGroups])

window.electronAPI.getApplications().then((apps) => {
  const appItems = apps.map(app => ({
    label: app.name,
    icon: 'i-lucide-app-window',
    onSelect() {
      window.electronAPI.launchApplication(app.appId)
    },
    featured: false,
  }))

  groups.value.push({
    id: 'installed-apps',
    label: 'Installed Applications',
    items: appItems,
  })
})

function postFilter(search: string, items: any[]) {
  if (!search) {
    return items.filter(i => i.featured)
  }
  return items
}

const computedGroups = computed(() => {
  return groups.value.map(g => ({
    ...g,
    postFilter,
  }))
})
</script>

<template>
  <UCommandPalette
    v-model:search-term="searchTerm"
    :groups="computedGroups"
  />
</template>

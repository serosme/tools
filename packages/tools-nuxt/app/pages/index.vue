<script setup lang="ts">
const { searchTerm, paletteKey, groups, pages, commands, resetPalette } = useCommand()
</script>

<template>
  <UCommandPalette
    :key="paletteKey"
    v-model:search-term="searchTerm"
    :groups="groups"
    :fuse="{
      resultLimit: pages.length + commands.length,
      matchAllWhenSearchEmpty: false,
      fuseOptions: {
        keys: ['label', 'suffix', 'keywords'],
      },
    }"
    @keydown.space.prevent
    @update:model-value="resetPalette"
  />
</template>

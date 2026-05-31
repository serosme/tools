<script setup lang="ts">
const { groups, pages, commands } = useCommand()
const searchTerm = ref('')
</script>

<template>
  <UCommandPalette
    v-model:search-term="searchTerm"
    :groups="groups"
    :fuse="{
      resultLimit: pages.length + commands.length,
      matchAllWhenSearchEmpty: false,
    }"
    @update:model-value="searchTerm = ''"
    @keydown.escape="searchTerm = ''"
    @keydown.space.prevent
  />
</template>

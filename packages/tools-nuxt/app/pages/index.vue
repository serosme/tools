<script setup lang="ts">
const { searchTerm, groups, pages, commands } = useCommand()
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
    @keydown.space.prevent
  />
</template>

<script setup lang="ts">
useHead({ title: 'Command' })

const { searchTerm, paletteKey, groups, resetPalette, resultLimit } = useCommand()
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
</template>

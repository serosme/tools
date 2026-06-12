<script setup lang="ts">
import { settings } from 'tools-shared'

definePageMeta({
  layout: 'setting',
})

const firstKey = Object.keys(settings)[0]
if (firstKey) {
  navigateTo(`/setting/${firstKey}`, { replace: true })
}
</script>

<template>
  <div />
</template>

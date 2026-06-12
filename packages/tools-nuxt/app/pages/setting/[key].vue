<script setup lang="ts">
import type { StoreSchema } from 'tools-shared'
import { settings } from 'tools-shared'

definePageMeta({
  layout: 'setting',
})

const route = useRoute()
const toast = useToast()

const sectionKey = route.params.key as string

if (!(sectionKey in settings)) {
  navigateTo('/setting', { replace: true })
}

const { conf, save } = useConf(sectionKey as keyof StoreSchema)

async function onSubmit() {
  await save()
  toast.add({
    title: '保存成功',
    color: 'success',
    duration: 1200,
  })
}
</script>

<template>
  <SettingForm
    v-if="sectionKey in settings"
    :section-key="sectionKey"
    :conf="conf"
    @submit="onSubmit"
  />
</template>

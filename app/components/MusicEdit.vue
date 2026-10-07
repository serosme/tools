<script setup lang="ts">
interface Props {
  id: string
}
const props = defineProps<Props>()

const emit = defineEmits<{
  saved: []
}>()
const toast = useToast()

const open = defineModel<boolean>('open', { required: true })
const tags = ref({ title: '', artist: '', album: '', lyrics: '' })
const info = ref('')

watch(open, (value) => {
  if (value)
    load()
})

async function load() {
  const data = await selfFetch('/api/music/tags', { query: { id: props.id } })
  tags.value = data.tags
  info.value = data.info
}

async function onClear() {
  await selfFetch('/api/music/tags', {
    method: 'DELETE',
    query: { id: props.id },
  })
  toast.add({ title: 'Tags cleared', color: 'success', duration: 1200 })
  await load()
  emit('saved')
}

async function onSubmit() {
  await selfFetch('/api/music/tags', {
    method: 'PUT',
    query: { id: props.id },
    body: tags.value,
  })
  toast.add({ title: 'Saved', color: 'success', duration: 1200 })
  await load()
  emit('saved')
}
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    :title="id"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm :state="tags" class="flex h-full gap-6" @submit="onSubmit">
        <div class="flex w-1/3 flex-col gap-4">
          <UFormField label="Title">
            <UInput v-model="tags.title" class="w-full" />
          </UFormField>
          <UFormField label="Artist">
            <UInput v-model="tags.artist" class="w-full" />
          </UFormField>
          <UFormField label="Album">
            <UInput v-model="tags.album" class="w-full" />
          </UFormField>
          <UFormField
            label="Info"
            class="flex min-h-0 flex-1 flex-col"
            :ui="{ container: 'min-h-0 flex-1' }"
          >
            <UTextarea
              :model-value="info"
              readonly
              class="h-full w-full"
              :ui="{ base: 'h-full resize-none scrollbar-none' }"
            />
          </UFormField>
        </div>

        <UFormField
          label="Lyrics"
          class="flex min-w-0 flex-1 flex-col"
          :ui="{ container: 'min-h-0 flex-1' }"
        >
          <UTextarea
            v-model="tags.lyrics"
            class="h-full w-full"
            :ui="{ base: 'h-full resize-none scrollbar-none' }"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Clear Tags"
        icon="i-lucide-eraser"
        color="error"
        variant="subtle"
        @click="onClear"
      />
      <UButton
        label="Save"
        @click="onSubmit"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'setting',
})

const toast = useToast()

const { conf, save } = useConf('music')

async function onSubmit() {
  save()
  toast.add({
    title: '成功',
    color: 'success',
    duration: 1200,
  })
}

async function selectMusicPath() {
  const path = await electron.path.folder.select()

  if (path) {
    conf.path = path
  }
}
</script>

<template>
  <UCard class="h-full">
    <UForm :state="conf" @submit="onSubmit">
      <UPageCard
        title="音乐"
        variant="naked"
        orientation="horizontal"
        class="mb-4"
      >
        <UButton
          label="保存"
          type="submit"
          class="cursor-pointer w-fit lg:ms-auto"
        />
      </UPageCard>
      <UPageCard>
        <UFormField
          label="音乐库位置"
          description="Will appear on receipts, invoices, and other communication."
          class="flex max-sm:flex-col justify-between items-start gap-4"
        >
          <UInput v-model="conf.path" readonly @click="selectMusicPath" />
        </UFormField>
      </UPageCard>
    </UForm>
  </UCard>
</template>

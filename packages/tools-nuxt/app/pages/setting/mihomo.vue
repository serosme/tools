<script setup lang="ts">
definePageMeta({
  layout: 'setting',
})

const toast = useToast()

const { conf, save } = useConf('mihomo')

async function onSubmit() {
  await save()
  toast.add({
    title: '成功',
    color: 'success',
    duration: 1200,
  })
}

async function selectMihomoPath() {
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
        title="Mihomo"
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
          label="Mihomo 路径"
          description="设置 mihomo 的工作目录路径，默认为 ~/.config/mihomo"
          class="flex max-sm:flex-col justify-between items-start gap-4"
        >
          <UInput v-model="conf.path" readonly @click="selectMihomoPath" />
        </UFormField>
      </UPageCard>
    </UForm>
  </UCard>
</template>

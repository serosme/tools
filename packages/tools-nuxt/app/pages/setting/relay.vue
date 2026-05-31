<script setup lang="ts">
definePageMeta({
  layout: 'setting',
})

const toast = useToast()

const { conf, save } = useConf('relay')

async function onSubmit() {
  save()
  toast.add({
    title: '成功',
    color: 'success',
    duration: 1200,
  })
}
</script>

<template>
  <UCard class="h-full">
    <UForm :state="conf" @submit="onSubmit">
      <UPageCard
        title="语音识别"
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
      <div class="grid grid-cols-2 gap-6">
        <UCard
          v-for="(item, index) in conf"
          :key="index"
        >
          <div class="flex flex-col  justify-center gap-2">
            <UFormField label="标识">
              <UInput
                v-model="item.key"
                class="w-full"
              />
            </UFormField>
            <UFormField label="脚本">
              <UInput
                v-model="item.js"
                class="w-full"
              />
            </UFormField>
            <UFormField label="脚本">
              <UTextarea
                v-model="item.js"
                class="w-full"
              />
            </UFormField>
          </div>
        </UCard>
      </div>
    </UForm>
  </UCard>
</template>

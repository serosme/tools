<script setup lang="ts">
import type { SettingSection } from 'tools-shared'
import { settings } from 'tools-shared'
import { computed, inject } from 'vue'

const props = defineProps<{
  sectionKey: string
}>()

const emit = defineEmits<{
  submit: []
}>()

const conf = inject<Record<string, any>>('sectionConf')!

const sectionSchema = computed(() => (settings as Record<string, SettingSection>)[props.sectionKey] ?? null)

const properties = computed(() => {
  const s = sectionSchema.value
  if (!s)
    return []
  return Object.entries(s.properties).map(([name, prop]) => ({
    name,
    schema: prop,
  }))
})

async function selectFolder(propName: string) {
  const folder = await electron.path.folder.select()
  if (folder) {
    conf[propName] = folder
  }
}
</script>

<template>
  <UCard class="h-full">
    <UForm :state="conf" @submit="emit('submit')">
      <UPageCard
        :title="sectionSchema?.label || sectionKey"
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
        <div
          v-for="(prop, index) in properties"
          :key="prop.name"
          class="flex max-sm:flex-col justify-between items-start gap-4"
          :class="index < properties.length - 1 ? 'mb-4 pb-4 border-b border-default' : ''"
        >
          <UFormField
            :label="prop.schema.label || prop.name"
            :description="prop.schema.description"
            class="flex-1"
          >
            <UInput
              v-if="!prop.schema.component || prop.schema.component === 'text'"
              v-model="conf[prop.name]"
              class="w-full"
            />
            <UInput
              v-else-if="prop.schema.component === 'password'"
              v-model="conf[prop.name]"
              type="password"
              class="w-full"
            />
            <UInput
              v-else-if="prop.schema.component === 'path'"
              v-model="conf[prop.name]"
              readonly
              class="w-full cursor-pointer"
              @click="selectFolder(prop.name)"
            />
          </UFormField>
        </div>
      </UPageCard>
    </UForm>
  </UCard>
</template>

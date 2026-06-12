<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { settings } from 'tools-shared'

const items: NavigationMenuItem[] = Object.entries(settings).map(([key, section]) => ({
  label: section.label,
  icon: section.icon,
  to: `/setting/${key}`,
}))
</script>

<template>
  <div class="h-screen w-screen flex flex-col flex-1">
    <UHeader title="Setting" :ui="{ container: 'px-4!' }" />

    <div class="flex flex-1 min-h-0">
      <USidebar
        collapsible="icon"
        :ui="{
          gap: 'h-[calc(100%-var(--ui-header-height))]',
          container:
            'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))]',
        }"
      >
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </USidebar>

      <div class="flex flex-1 min-h-0 flex-col p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

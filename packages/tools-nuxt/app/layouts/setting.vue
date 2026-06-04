<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/setting',
  },
  {
    label: 'Music',
    icon: 'i-lucide-music',
    to: '/setting/music',
  },
  {
    label: 'Asr',
    icon: 'i-lucide-mic',
    to: '/setting/asr',
  },
]
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

<script setup lang="ts">
import type { DropdownMenuItem, TableColumn, TableRow } from '@nuxt/ui'

const edit = ref({ open: false, id: '' })

const {
  musics,
  current,
  playAt,
  next,
  prev,
  playing,
  currentTime,
  duration,
  volume,
} = useMusic()

function formatTime(seconds: number): string {
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const secs = total % 60

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const columns: TableColumn<Music>[] = [
  {
    accessorKey: 'index',
    header: '#',
  },
  {
    accessorKey: 'title',
    header: '名称',
  },
  {
    accessorKey: 'duration',
    header: '时长',
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return formatTime(value)
    },
  },
  {
    id: 'action',
  },
]
function onSelect(_e: Event, row: TableRow<Music>) {
  playAt(row.original.index)
}
function getDropdownActions(music: Music): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        onSelect: () => {
          edit.value = { open: true, id: music.id }
        },
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
      },
    ],
  ]
}
</script>

<template>
  <div class="flex h-screen flex-col">
    <div id="1" class="flex flex-1">
      <div id="1-1" class="w-1/3">
        <UTable
          :data="musics"
          :columns="columns"
          class="h-full"
          @select="onSelect"
        >
          <template #action-cell="{ row }">
            <UDropdownMenu :items="getDropdownActions(row.original)">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                aria-label="Actions"
              />
            </UDropdownMenu>
          </template>
        </UTable>
        <!-- 音乐编辑 -->
        <MusicEdit :id="edit.id" v-model:open="edit.open" />
      </div>
      <div id="1-2" class="flex-1 bg-gray-200" />
    </div>
    <div id="2" class="flex h-1/6 gap-6 px-6">
      <div id="2-1" class="w-1/5 flex items-center gap-4">
        <NuxtImg
          src="https://picsum.photos/200"
          class="rounded-md size-16 object-cover shrink-0"
        />
        <div class="flex flex-col truncate">
          <span class="text-lg font-medium truncate"> {{ current.title }}</span>
          <span class="text-base text-gray-500 truncate">{{ current.artist }}</span>
        </div>
      </div>
      <div id="2-2" class="w-3/5 flex flex-col items-center justify-center gap-3">
        <div class="flex items-center justify-center gap-8">
          <Icon
            name="solar:shuffle-outline"
            class="text-neutral cursor-pointer"
            size="1.5em"
          />
          <UButton
            icon="solar:skip-previous-bold"
            variant="link"
            size="xl"
            color="neutral"
            class="rounded-full cursor-pointer"
            :ui="{
              base: 'p-0',
            }"
            @click="prev()"
          />
          <UButton
            :icon="playing ? 'solar:pause-circle-bold' : 'solar:play-circle-bold'"
            variant="link"
            size="xl"
            class="rounded-full cursor-pointer"
            :ui="{
              base: 'p-0',
              leadingIcon: 'size-12',
            }"
            @click="playing = !playing"
          />
          <UButton
            icon="solar:skip-next-bold"
            variant="link"
            size="xl"
            color="neutral"
            class="rounded-full cursor-pointer"
            :ui="{
              base: 'p-0',
            }"
            @click="next()"
          />
          <Icon
            name="solar:repeat-outline"
            class="text-neutral cursor-pointer"
            size="1.5em"
          />
        </div>
        <div class="flex items-center gap-2 w-full max-w-2xl">
          <span class="text-sm tabular-nums">{{ formatTime(currentTime) }}</span>
          <USlider
            v-model="currentTime"
            :min="0"
            :max="duration"
            :ui="{
              root: 'cursor-pointer',
            }"
          />
          <span class="text-sm tabular-nums">{{ formatTime(duration) }}</span>
        </div>
      </div>
      <div id="2-3" class="w-1/5 flex items-center gap-2">
        <UButton
          icon="solar:volume-loud-outline"
          variant="link"
          color="neutral"
          class="cursor-pointer"
        />
        <USlider
          v-model="volume"
          :min="0"
          :max="1"
          :step="0.01"
          :ui="{
            root: 'cursor-pointer',
          }"
        />
      </div>
    </div>
  </div>
</template>

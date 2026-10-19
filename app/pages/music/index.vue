<script setup lang="ts">
import type { ContextMenuItem, TableColumn, TableRow } from '@nuxt/ui'

useHead({ title: 'Music' })

const edit = ref({ open: false, id: '' })
const contextId = ref('')
const toast = useToast()

const {
  musics,
  current,
  cover,
  lyrics,
  load,
  playAt,
  next,
  prev,
  togglePlay,
  currentTime,
  duration,
  displayVolume,
  muted,
  shuffle,
  repeat,
  wantPlay,
} = useMusic()

function formatTime(seconds: number): string {
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const secs = total % 60

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

type SliderValue = number | number[]

function sliderModel(source: Ref<number>) {
  return computed<SliderValue>({
    get: () => source.value,
    set: (value) => {
      source.value = Array.isArray(value) ? value[0]! : value
    },
  })
}

const seeking = ref(false)
const seekValue = ref(0)

// 拖动进度条时只更新显示，松手（@change）才真正 seek：避免连续 seek 让解码器反复重启
// 没有曲目时归零：媒体元素会保留上一首的时间和时长
const displayTime = computed(() => {
  if (!current.value.id)
    return 0

  return seeking.value ? seekValue.value : currentTime.value
})
const displayDuration = computed(() => current.value.id ? duration.value : 0)

const currentTimeSlider = computed<SliderValue>({
  get: () => displayTime.value,
  set: (value) => {
    seeking.value = true
    seekValue.value = Array.isArray(value) ? value[0]! : value
  },
})

function commitSeek() {
  if (!seeking.value)
    return

  seeking.value = false
  currentTime.value = seekValue.value
}

const volumeSlider = sliderModel(displayVolume)

const columns: TableColumn<Music>[] = [
  {
    id: 'index',
    header: '#',
    meta: { class: { th: 'w-12', td: 'w-12 text-dimmed tabular-nums' } },
    cell: ({ row }) => String(row.index),
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'artist',
    header: 'Artist',
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    meta: { class: { th: 'w-20 text-end', td: 'w-20 text-end tabular-nums' } },
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return formatTime(value)
    },
  },
]

// 正在播放的那一行高亮（函数在每次渲染时按行求值）
const tableMeta = {
  class: {
    tr: (row: TableRow<Music>) => row.original.id === current.value.id ? 'bg-elevated/50' : '',
  },
}

// UTable 的 root 就是滚动容器（theme root 是 overflow-auto），遮罩必须挂在它身上才有意义；
// 表头因此不能留在表内（sticky 的 thead 会被上下边缘的渐变一起淡掉），改为手写在滚动容器外面
const tableRef = useTemplateRef('tableRef')
const tableMask = useScrollMask(computed(() => (tableRef.value?.$el as HTMLElement | undefined) ?? null))

function onSelect(_e: Event, row: TableRow<Music>) {
  playAt(row.original)
}

function onContextMenu(_e: Event, row: TableRow<Music>) {
  contextId.value = row.original.id
}

async function onDelete() {
  await selfFetch('/api/music', {
    method: 'DELETE',
    query: { id: contextId.value },
  })
  toast.add({ title: 'Deleted', color: 'success', duration: 1200 })
  await load()
}

const rowMenu = computed<ContextMenuItem[][]>(() => [
  [
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      onSelect: () => {
        edit.value = { open: true, id: contextId.value }
      },
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: onDelete,
    },
  ],
])
</script>

<template>
  <div class="flex h-screen flex-col">
    <div class="flex min-h-0 flex-1">
      <div class="flex h-full w-1/3 flex-col overflow-hidden">
        <!-- 表头在滚动容器外，才不会被遮罩淡掉；列宽与 th 文案需手动与 columns 保持一致 -->
        <table class="w-full table-fixed text-sm text-highlighted">
          <thead>
            <tr class="border-b border-accented">
              <th class="w-12 px-4 py-3.5 text-start font-semibold">
                #
              </th>
              <th class="px-4 py-3.5 text-start font-semibold">
                Title
              </th>
              <th class="px-4 py-3.5 text-start font-semibold">
                Artist
              </th>
              <th class="w-20 px-4 py-3.5 text-end font-semibold">
                Duration
              </th>
            </tr>
          </thead>
        </table>
        <UContextMenu :items="rowMenu">
          <UTable
            ref="tableRef"
            :data="musics"
            :columns="columns"
            :meta="tableMeta"
            class="min-h-0 flex-1 scrollbar-none"
            :style="tableMask"
            :ui="{ base: 'w-full table-fixed', thead: 'hidden' }"
            @select="onSelect"
            @contextmenu="onContextMenu"
          >
            <template #title-cell="{ getValue }">
              <span class="block truncate" :title="getValue<string>()">{{ getValue() }}</span>
            </template>
            <template #artist-cell="{ getValue }">
              <span class="block truncate" :title="getValue<string>()">{{ getValue() }}</span>
            </template>
          </UTable>
        </UContextMenu>
        <MusicEdit :id="edit.id" v-model:open="edit.open" @saved="load" />
      </div>
      <div class="flex-1 overflow-hidden p-6">
        <LyricsPanel :text="lyrics" :current-time="currentTime" />
      </div>
    </div>
    <div class="flex gap-6 px-6 py-4">
      <div class="flex w-1/5 items-center gap-4">
        <div class="size-16 shrink-0 flex items-center justify-center">
          <img
            v-if="current.hasCover"
            :src="cover"
            class="rounded-md size-full object-cover"
            alt="cover"
          >
          <Icon
            v-else
            name="i-lucide-music"
            size="2.5em"
            class="text-neutral"
          />
        </div>
        <div class="flex flex-col truncate">
          <span class="text-lg font-medium truncate">{{ current.title }}</span>
          <span class="text-base text-gray-500 truncate">{{ current.artist }}</span>
        </div>
      </div>
      <div class="flex w-3/5 flex-col items-center justify-center gap-3">
        <!-- 未选曲时控制按钮禁用；禁用态用默认光标（! 覆盖 Nuxt UI 的 disabled:cursor-not-allowed） -->
        <div class="flex items-center justify-center gap-8">
          <UButton
            icon="i-lucide-shuffle"
            variant="link"
            size="lg"
            :color="shuffle ? 'primary' : 'neutral'"
            :ui="{
              base: 'p-0',
            }"
            @click="shuffle = !shuffle"
          />
          <UButton
            icon="i-lucide-skip-back"
            variant="link"
            size="xl"
            color="neutral"
            :disabled="!current.id"
            :ui="{
              base: 'p-0 disabled:cursor-default!',
            }"
            @click="prev()"
          />
          <UButton
            :icon="wantPlay ? 'i-lucide-pause' : 'i-lucide-play'"
            variant="link"
            size="xl"
            :disabled="!current.id"
            :ui="{
              base: 'p-0 disabled:cursor-default!',
              leadingIcon: 'size-12',
            }"
            @click="togglePlay()"
          />
          <UButton
            icon="i-lucide-skip-forward"
            variant="link"
            size="xl"
            color="neutral"
            :disabled="!current.id"
            :ui="{
              base: 'p-0 disabled:cursor-default!',
            }"
            @click="next()"
          />
          <UButton
            icon="i-lucide-repeat"
            variant="link"
            size="lg"
            :color="repeat ? 'primary' : 'neutral'"
            :ui="{
              base: 'p-0',
            }"
            @click="repeat = !repeat"
          />
        </div>
        <div class="flex items-center gap-2 w-full max-w-2xl">
          <span class="text-sm tabular-nums">{{ formatTime(displayTime) }}</span>
          <USlider
            v-model="currentTimeSlider"
            :min="0"
            :max="displayDuration || 1"
            :disabled="!current.id"
            :ui="{
              root: current.id ? 'cursor-pointer' : 'cursor-default',
            }"
            @change="commitSeek"
            @pointercancel="commitSeek"
          />
          <span class="text-sm tabular-nums">{{ formatTime(displayDuration) }}</span>
        </div>
      </div>
      <div class="flex w-1/5 items-center gap-2">
        <UButton
          :icon="muted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'"
          variant="link"
          color="neutral"
          @click="muted = !muted"
        />
        <USlider
          v-model="volumeSlider"
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

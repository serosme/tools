<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface MusicFile { name: string, id: string }

const musicFiles = ref<MusicFile[]>([])
const currentFile = ref<MusicFile | null>(null)
const volume = ref(0.3)
const currentTime = ref(0)
const duration = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)

const openLyricWindow = () => window.electronAPI.showLyricWindow()

async function playMusic(file: MusicFile) {
  currentFile.value = file
  currentTime.value = duration.value = 0
}

watch(volume, (v) => {
  if (audioRef.value)
    audioRef.value.volume = v
})

onMounted(async () => {
  const { data } = await useFetch<MusicFile[]>('/api/music/list')
  musicFiles.value = data.value || []
})
</script>

<template>
  <div class="p-4">
    <div class="flex gap-2 mb-4">
      <UButton to="/">
        返回首页
      </UButton>
      <UButton @click="openLyricWindow">
        桌面歌词
      </UButton>
    </div>

    <h1 class="text-xl font-bold mb-4">
      音乐播放器
    </h1>

    <div v-if="musicFiles.length" class="mb-4">
      <div
        v-for="file in musicFiles"
        :key="file.id"
        class="p-2 cursor-pointer hover:bg-gray-100 rounded"
        :class="{ 'bg-blue-100': currentFile?.id === file.id }"
        @click="playMusic(file)"
      >
        {{ file.name }}
      </div>
    </div>

    <div v-if="currentFile" class="mt-4">
      <p class="text-sm text-gray-600 mb-2">
        当前播放：{{ currentFile.name }}
      </p>

      <audio
        ref="audioRef"
        :src="`/api/music/${encodeURIComponent(currentFile.id)}`"
        class="w-full mb-4"
        controls
        autoplay
        @loadedmetadata="(e: Event) => duration = (e.target as HTMLAudioElement).duration"
        @timeupdate="(e: Event) => currentTime = (e.target as HTMLAudioElement).currentTime"
      />

      <div class="mb-4">
        <USlider
          :model-value="duration ? (currentTime / duration) * 100 : 0"
          :max="100"
          :step="0.1"
          disabled
          class="w-full"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">音量</span>
        <USlider v-model="volume" :max="1" :step="0.01" orientation="vertical" class="h-24" />
        <span class="text-xs text-gray-500">{{ Math.round(volume * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

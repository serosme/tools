<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

interface LyricLine {
  time: number
  text: string
}

interface Props {
  text: string
  currentTime: number
}
const props = defineProps<Props>()

function parseLrc(raw: string): LyricLine[] {
  return raw.split(/\r?\n/).flatMap((line) => {
    const matches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g)]
    const text = line.replace(/^\s*(?:\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]\s*)+/, '').trim()
    if (!matches.length || !text)
      return []

    return matches.map(([, m, s, ms]) => ({
      time: Number(m) * 60 + Number(s) + (ms ? Number(ms) / 10 ** ms.length : 0),
      text,
    }))
  }).sort((a, b) => a.time - b.time)
}

const lines = computed<LyricLine[]>(() => parseLrc(props.text))

// 歌词提前量（秒）：补偿 timeupdate 事件间隔与平滑滚动动画的感知延迟
const LYRIC_OFFSET = 0.1

const activeIndex = computed(() =>
  lines.value.findLastIndex(line => line.time <= props.currentTime + LYRIC_OFFSET),
)

// 行高：与下方条目的 h-10 对应
const LINE_HEIGHT = 40
// 边缘淡出深度取行高的两倍，让整行在渐变里完成进出场，而不是被切掉半行
const SHADOW_SIZE = 80

const container = useTemplateRef<HTMLDivElement>('container')
const { height } = useElementSize(container)

// 上下各留 (容器高 - 行高) / 2 的空白：缺这段留白时 align: 'center' 会在两端被钳制，
// 首行与末行只能贴在边缘的淡出区里，永远居不了中
const padding = computed(() => Math.max((height.value - LINE_HEIGHT) / 2, 0))

const virtualizeOptions = computed(() => ({
  estimateSize: LINE_HEIGHT,
  skipMeasurement: true,
  paddingStart: padding.value,
  paddingEnd: padding.value,
}))

const scrollArea = useTemplateRef('scrollArea')

// height 一并作为依赖：容器尺寸变化后重新居中，顺带校正首帧 padding 尚未测量时的那次定位。
// 仅尺寸变化时用 auto，避免拖拽窗口时平滑动画一直追不上中心
watch([activeIndex, lines, height], ([index], [prevIndex]) => {
  scrollArea.value?.virtualizer?.scrollToIndex(Math.max(index, 0), {
    align: 'center',
    behavior: index === prevIndex ? 'auto' : 'smooth',
  })
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div ref="container" class="h-full w-full">
    <UScrollArea
      v-if="lines.length"
      ref="scrollArea"
      class="h-full w-full select-none overflow-hidden!"
      :items="lines"
      :shadow="{ size: SHADOW_SIZE }"
      :virtualize="virtualizeOptions"
    >
      <template #default="{ item, index }">
        <div
          class="flex h-10 items-center justify-center px-6 text-lg leading-relaxed truncate transition-colors duration-300"
          :class="index === activeIndex ? 'text-primary font-medium' : 'text-gray-400'"
        >
          {{ item.text }}
        </div>
      </template>
    </UScrollArea>
  </div>
</template>

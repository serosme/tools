import { useMediaControls } from '@vueuse/core'

export function useMusic() {
  const audio = ref<HTMLAudioElement>()
  const musics = ref<Music[]>([])
  const index = ref<number>(0)
  const current = computed(() => {
    return musics.value[index.value] || {
      id: '',
      index: 0,
      title: '未知歌曲',
      artist: '未知艺术家',
      duration: 0,
    }
  })
  const src = computed(() => {
    if (!current.value.id)
      return ''
    const params = new URLSearchParams({ id: current.value.id })
    return `/api/music/stream?${params.toString()}`
  })
  const { playing, currentTime, duration, volume } = useMediaControls(
    audio,
    { src },
  )

  const load = async () => {
    const data = await $fetch(`/api/music`)
    musics.value = data
  }

  const playAt = (i: number) => {
    index.value = i
    setTimeout(() => {
      playing.value = true
    }, 50)
  }

  const next = () => {
    const nextIndex = (index.value + 1) % musics.value.length
    playAt(nextIndex)
  }

  const prev = () => {
    const prevIndex = index.value === 0
      ? musics.value.length - 1
      : index.value - 1
    playAt(prevIndex)
  }

  onMounted(async () => {
    audio.value = new Audio()
    await load()
  })

  return {
    musics,
    current,
    playAt,
    next,
    prev,
    playing,
    currentTime,
    duration,
    volume,
  }
}

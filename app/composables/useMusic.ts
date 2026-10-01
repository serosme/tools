import { useMediaControls } from '@vueuse/core'

export function useMusic() {
  const audio = ref(new Audio())
  const musics = ref<Music[]>([])
  const currentId = ref('')
  const shuffle = ref(false)
  const repeat = ref(false)
  const wantPlay = ref(false)

  const current = computed(() => musics.value.find(music => music.id === currentId.value) || {
    id: '',
    title: 'Unknown Title',
    artist: 'Unknown Artist',
    duration: 0,
    hasCover: false,
  })
  const currentIndex = computed(() => musics.value.findIndex(music => music.id === currentId.value))
  const fileUrl = (route: string) => current.value.id
    ? `/api/music/${route}?id=${encodeURIComponent(current.value.id)}`
    : ''
  const src = computed(() => fileUrl('stream'))
  const cover = computed(() => fileUrl('cover'))
  const { currentTime, duration, volume, muted, ended } = useMediaControls(
    audio,
    { src },
  )

  // 切歌或播放意图变化后，等 src 落进 audio 元素再下发播放/暂停
  watch([src, wantPlay], () => {
    if (wantPlay.value)
      audio.value.play()
    else
      audio.value.pause()
  }, { flush: 'post' })

  const lyrics = ref('')
  watch(() => current.value.id, async (id) => {
    if (!id) {
      lyrics.value = ''
      return
    }

    const { text } = await selfFetch<{ text: string }>('/api/music/lyrics', { params: { id } })

    if (current.value.id === id)
      lyrics.value = text
  })

  // 显示音量：静音时显示 0，拖动滑块时写入真实音量并取消静音
  const displayVolume = computed({
    get: () => muted.value ? 0 : volume.value,
    set: (v: number) => {
      volume.value = v
      if (muted.value)
        muted.value = false
    },
  })

  async function load() {
    musics.value = await selfFetch<Music[]>('/api/music')

    // 正在播放的文件被删或改名后，列表里已找不到它，就停下来
    if (currentId.value && !musics.value.some(music => music.id === currentId.value))
      wantPlay.value = false
  }

  function togglePlay() {
    wantPlay.value = !wantPlay.value
  }

  function playAt(music: Music | undefined) {
    if (!music)
      return

    currentId.value = music.id
    wantPlay.value = true
  }

  function playRandom() {
    let i
    do {
      i = Math.floor(Math.random() * musics.value.length)
    } while (i === currentIndex.value && musics.value.length > 1)

    playAt(musics.value[i])
  }

  function next() {
    if (shuffle.value) {
      playRandom()
      return
    }

    playAt(musics.value[(currentIndex.value + 1) % musics.value.length])
  }

  function prev() {
    const index = currentIndex.value
    playAt(musics.value[index <= 0 ? musics.value.length - 1 : index - 1])
  }

  // 播放结束自动下一首：随机模式随机切换，顺序模式到末尾时仅循环模式继续
  watch(ended, (isEnded) => {
    if (!isEnded)
      return

    if (shuffle.value) {
      playRandom()
      return
    }

    const following = musics.value[currentIndex.value + 1]
    if (following)
      playAt(following)
    else if (repeat.value)
      playAt(musics.value[0])
    else
      wantPlay.value = false
  })

  onMounted(async () => {
    volume.value = 0.5
    await load()
  })

  onBeforeUnmount(() => {
    audio.value.pause()
    audio.value.removeAttribute('src')
    audio.value.load()
  })

  return {
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
  }
}

<script setup lang="ts">
definePageMeta({
  layout: 'lyric',
})

const items = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
]
const carousel = useTemplateRef('carousel')

onMounted(() => {
  let i = 0
  setInterval(() => {
    carousel.value?.emblaApi?.scrollTo(i)
    i++
    if (i >= items.length) {
      i = 0
    }
  }, 1000)
})
</script>

<template>
  <div>
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      orientation="vertical"
      :items="items"
      :ui="{ container: 'h-10' }"
      class="w-full max-w-xs mx-auto bg-amber-300"
    >
      <div class="text-red-500 text-center">
        {{ item }}
      </div>
    </UCarousel>
  </div>
</template>

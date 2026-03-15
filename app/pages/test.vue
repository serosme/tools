<script setup>
const { data } = await useFetch('/api/hello')
const msg = data.value?.msg
</script>

<template>
  <div>
    <h1>Nuxt inside Electron</h1>
    <p>{{ msg }}</p>
  </div>
</template>

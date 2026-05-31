// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vueuse/core',
      ],
    },
  },
})

export default defineNuxtConfig({
  compatibilityDate: '2026-06-30',

  ssr: false,

  ui: {
    fonts: false,
  },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/ui'],

  devtools: {
    enabled: false,
  },
})

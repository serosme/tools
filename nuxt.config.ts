// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },
  ssr: false,
  app: {
    cdnURL: './',
  },
  router: {
    options: {
      hashMode: true,
    },
  },
})

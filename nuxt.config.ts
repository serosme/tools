export default defineNuxtConfig({
  compatibilityDate: '2026-06-30',

  ssr: false,

  ui: {
    fonts: false,
  },

  icon: {
    provider: 'none',
    clientBundle: {
      scan: {
        globInclude: ['**/*.{vue,jsx,tsx,ts,md,mdc,mdx,yml,yaml}'],
      },
    },
  },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/ui'],

  devtools: {
    enabled: false,
  },
})

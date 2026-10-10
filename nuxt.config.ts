export default defineNuxtConfig({
  compatibilityDate: '2026-10-05',

  ssr: false,

  experimental: {
    // 从生成的服务端路由类型化 $fetch / useFetch（Nuxt 5 默认开启）
    routeTypedFetch: true,
    // 拼错的路径 / 路由不支持的 method 直接报类型错误
    strictRouteTypes: true,
  },

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

  modules: ['@nuxt/ui', '@comark/nuxt'],

  devtools: {
    enabled: false,
  },
})

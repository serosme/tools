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

  // 临时绕过 Nuxt 4.6.0 在 Windows 上的已知 bug（nuxt#36467）：
  // Nitro 的 externals 匹配不归一化反斜杠，SSR renderer 被外置后拿不到 manifest，
  // 页面会 500「Either manifest or precomputed data must be provided」。
  // 官方已 hotfix，升级到下一个 4.x 补丁后删除。
  nitro: {
    externals: {
      inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/],
    },
  },

  devtools: {
    enabled: false,
  },
})

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // 如果焦点在 allow-tab 容器内，放行
        if ((e.target as HTMLElement).closest('[allow-tab]'))
          return
        e.preventDefault()
      }
    })
  }
})

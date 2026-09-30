export default defineNitroPlugin((nitroApp) => {
  startAsr()
  nitroApp.hooks.hook('close', () => stopAsr())
})

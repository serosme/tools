export default defineEventHandler((event) => {
  const { label } = getQuery(event) as { label: string }
  runPreset(label)
})

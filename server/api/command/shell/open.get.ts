export default defineEventHandler((event) => {
  const { name } = getQuery(event) as { name: string }
  openShell(name)
})

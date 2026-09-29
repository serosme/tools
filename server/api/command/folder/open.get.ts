export default defineEventHandler((event) => {
  const { name } = getQuery(event) as { name: string }
  spawnProcess('explorer.exe', [getFolderPath(name)])
})

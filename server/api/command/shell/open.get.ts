export default defineEventHandler((event) => {
  const { command } = getQuery(event) as { command: string }
  openShell(command)
})

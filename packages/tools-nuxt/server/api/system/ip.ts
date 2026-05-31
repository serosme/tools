import os from 'node:os'

export default defineEventHandler((): string[] => {
  const interfaces = os.networkInterfaces()
  return Object.values(interfaces)
    .flatMap((ifaces) => {
      if (!ifaces)
        return []
      return ifaces
        .filter(iface => iface.family === 'IPv4' && !iface.internal)
        .map(iface => iface.address)
    })
})

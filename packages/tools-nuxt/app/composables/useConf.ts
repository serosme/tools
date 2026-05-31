import type { StoreSchema } from 'tools-shared'

export function useConf<K extends keyof StoreSchema>(key: K) {
  const conf = reactive<StoreSchema[K]>({} as StoreSchema[K])

  const load = async () => {
    const data = await $fetch<StoreSchema[K]>(`/api/conf/${key}`)
    Object.assign(conf, data)
  }

  const save = async () => {
    await $fetch<boolean>(`/api/conf/${key}`, {
      method: 'POST',
      body: toRaw(conf),
    })
  }

  onMounted(load)

  return {
    conf,
    load,
    save,
  }
}

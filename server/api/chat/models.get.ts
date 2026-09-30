interface ModelListResp {
  data: Array<{ id: string, name?: string }>
}

interface ModelOption {
  label: string
  value: string
  default?: boolean
}

export default defineEventHandler(async () => {
  const { baseUrl, apiKey, defaultModel = '', modelKeywords = [] } = readConf().chat

  const { data } = await $fetch<ModelListResp>(`${baseUrl}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  const keywords = modelKeywords.map(keyword => keyword.toLowerCase())

  const models: ModelOption[] = data
    .filter(({ id }) => {
      if (id === defaultModel)
        return true

      if (!keywords.length)
        return true

      return keywords.some(keyword => id.toLowerCase().includes(keyword))
    })
    .map(({ id, name }) => ({ label: name || id, value: id }))
    .sort((a, b) => b.value.localeCompare(a.value))

  const defaultItem = models.find(item => item.value === defaultModel) ?? models[0]

  return models.map(item => (item === defaultItem ? { ...item, default: true } : item))
})

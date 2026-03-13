<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
import type { UIMessage } from 'ai'

const items = ref<SelectItem[]>([
  {
    label: 'DeepSeek',
    id: 'deepSeekChatClient',
    icon: 'i-ri-deepseek-fill',
  },
  {
    label: 'DashScope',
    id: 'dashScopeChatClient',
    icon: 'i-ri-search-eye-line',
  },
])
const value = ref('deepSeekChatClient')
const icon = computed(() => {
  return items.value.find(i => i.id === value.value)?.icon
})

const input = ref('')
const messages = ref<UIMessage[]>([])

async function send() {
  if (!input.value.trim())
    return

  // 用户消息
  const userMessage: UIMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    parts: [{ type: 'text', text: input.value }],
  }
  messages.value.push(userMessage)

  // 空的助手消息
  const assistantMessage: UIMessage = {
    id: crypto.randomUUID(),
    role: 'assistant',
    parts: [{ type: 'text', text: '' }],
  }
  messages.value.push(assistantMessage)

  const messageText = input.value
  input.value = ''

  // 流式请求
  try {
    await streamAssistantResponse(messageText)
  }
  catch (err) {
    console.error(err)
  }
}

async function streamAssistantResponse(message: string) {
  const response = await fetch(`/api/easy-chat/stream?client=${encodeURIComponent(value.value)}&message=${encodeURIComponent(message)}`)
  if (!response.body)
    return

  // 使用 TextDecoderStream 将字节流转为字符串流
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .getReader()

  let accumulatedText = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done)
        break
      if (value) {
        const lastIndex = messages.value.length - 1
        const lastMessage = messages.value[lastIndex]
        accumulatedText += value
        if (!lastMessage)
          return

        lastMessage.parts[0].text = accumulatedText
      }
    }
  }
  finally {
    reader.releaseLock()
  }
}
</script>

<template>
  <UContainer class="flex flex-col h-screen">
    <div class="flex-1 overflow-y-auto mb-8 mt-8">
      <UChatMessages :messages="messages">
        <template #content="{ message }">
          <template
            v-for="(part, index) in message.parts"
            :key="`${message.id}-${index}`"
          >
            <MDC
              v-if="part.type === 'text'"
              :value="part.text"
              :cache-key="`${message.id}-${index}`"
              class="*:first:mt-0 *:last:mb-0"
            />
          </template>
        </template>
      </UChatMessages>
    </div>

    <div class="mb-8">
      <UChatPrompt
        v-model="input"
        placeholder="Ask AI..."
        :rows="2"
        @submit.prevent="send"
      >
        <!-- <template #leading>
          <UButton icon="i-lucide-paperclip" />
        </template> -->

        <template #footer>
          <USelect v-model="value" color="neutral" :icon="icon" variant="none" value-key="id" :items="items" class="w-48" />
          <UChatPromptSubmit />
        </template>
        <!-- <UChatPromptSubmit /> -->
      </UChatPrompt>
    </div>
  </UContainer>
</template>

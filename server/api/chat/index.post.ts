import type { UIMessage } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  smoothStream,
  streamText,
  toUIMessageStream,
} from 'ai'
import { aiTools } from '../../utils/ai-tools'

interface ChatBody {
  messages: UIMessage[]
  model: string
}

export default defineEventHandler(async (event) => {
  const { messages, model } = await readBody<ChatBody>(event)
  const { baseUrl, apiKey } = readConf().chat

  const provider = createOpenAICompatible({
    name: 'custom',
    baseURL: baseUrl,
    apiKey,
  })

  const result = streamText({
    model: provider(model),
    messages: await convertToModelMessages(messages),
    tools: aiTools,
    stopWhen: isStepCount(3),
    experimental_transform: smoothStream({
      delayInMs: 12,
      chunking: new Intl.Segmenter('zh', {
        granularity: 'word',
      }),
    }),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, sendReasoning: true }),
  })
})

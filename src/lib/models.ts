import 'server-only'

import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'

export const models = {
  openai: {
    gpt4o: createOpenAI({
      compatibility: 'strict',
      apiKey: process.env.OPENAI_API_KEY,
    })('gpt-4o-2024-08-06', {
      structuredOutputs: true,
    }),
  },
  anthropic: {
    claude35Sonnet: createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })('claude-3-5-sonnet-20240620'),
  },
}

import { Message } from '@/types'

const MIMO_API_URL = process.env.NEXT_PUBLIC_MIMO_API_URL || 'http://100.91.112.121:8317/v1/chat/completions'
const MODEL = 'Mimo-V2.5-Pro'

export async function* streamChatCompletion(messages: Message[]): AsyncGenerator<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No reader available')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === 'data: [DONE]') continue
      if (!trimmed.startsWith('data: ')) continue

      try {
        const data = JSON.parse(trimmed.slice(6))
        const content = data.choices?.[0]?.delta?.content
        if (content) yield content
      } catch {
        // Skip malformed JSON
      }
    }
  }
}

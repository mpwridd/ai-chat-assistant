import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const apiKey = process.env.MIMO_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'MIMO_API_KEY not configured' },
        { status: 500 }
      )
    }

    const mimoApiUrl = process.env.MIMO_API_URL || 'http://100.91.112.121:8317/v1/chat/completions'

    const response = await fetch(mimoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Mimo-V2.5-Pro',
        messages: messages.map((m: ChatMessage) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Mimo API error:', response.status, errorText)
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      )
    }

    // Stream the response
    const reader = response.body?.getReader()
    if (!reader) {
      return NextResponse.json(
        { error: 'No response body' },
        { status: 500 }
      )
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
        } catch (error) {
          console.error('Stream error:', error)
        } finally {
          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

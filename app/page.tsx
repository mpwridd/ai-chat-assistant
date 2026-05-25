'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ChatArea } from '@/components/ChatArea'
import { Conversation, Message, ChatState } from '@/types'
import { generateId, generateConversationTitle } from '@/lib/utils'

export default function Home() {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversationId: null,
    isLoading: false,
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const activeConversation = state.conversations.find(
    c => c.id === state.activeConversationId
  )

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setState(prev => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
      activeConversationId: newConversation.id,
    }))

    setSidebarOpen(false)
  }, [])

  const selectConversation = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      activeConversationId: id,
    }))
    setSidebarOpen(false)
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setState(prev => {
      const filtered = prev.conversations.filter(c => c.id !== id)
      return {
        ...prev,
        conversations: filtered,
        activeConversationId:
          prev.activeConversationId === id
            ? filtered[0]?.id || null
            : prev.activeConversationId,
      }
    })
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    let conversationId = state.activeConversationId

    // Create new conversation if none exists
    if (!conversationId) {
      const newConversation: Conversation = {
        id: generateId(),
        title: generateConversationTitle(content),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      conversationId = newConversation.id
      setState(prev => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
        activeConversationId: newConversation.id,
      }))
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    // Add user message
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              title: c.messages.length === 0 ? generateConversationTitle(content) : c.title,
              updatedAt: Date.now(),
            }
          : c
      ),
      isLoading: true,
    }))

    // Create assistant message placeholder
    const assistantMessageId = generateId()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, assistantMessage] }
          : c
      ),
    }))

    try {
      // Abort any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const conversation = state.conversations.find(c => c.id === conversationId)
      const allMessages = [...(conversation?.messages || []), userMessage]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''

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
            const delta = data.choices?.[0]?.delta?.content
            if (delta) {
              fullContent += delta
              const currentContent = fullContent
              setState(prev => ({
                ...prev,
                conversations: prev.conversations.map(c =>
                  c.id === conversationId
                    ? {
                        ...c,
                        messages: c.messages.map(m =>
                          m.id === assistantMessageId
                            ? { ...m, content: currentContent }
                            : m
                        ),
                        updatedAt: Date.now(),
                      }
                    : c
                ),
              }))
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return
      
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.map(c =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        content: 'Sorry, I encountered an error. Please try again.',
                      }
                    : m
                ),
              }
            : c
        ),
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.activeConversationId, state.conversations])

  // Create initial conversation if none exist
  useEffect(() => {
    if (state.conversations.length === 0) {
      createNewConversation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      <Sidebar
        conversations={state.conversations}
        activeConversationId={state.activeConversationId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={createNewConversation}
        onSelect={selectConversation}
        onDelete={deleteConversation}
      />
      
      <ChatArea
        conversation={activeConversation}
        isLoading={state.isLoading}
        onSendMessage={sendMessage}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  )
}

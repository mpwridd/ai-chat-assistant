'use client'

import { useRef, useEffect } from 'react'
import { Conversation } from '@/types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'

interface ChatAreaProps {
  conversation: Conversation | undefined
  isLoading: boolean
  onSendMessage: (content: string) => void
  onToggleSidebar: () => void
}

export function ChatArea({
  conversation,
  isLoading,
  onSendMessage,
  onToggleSidebar,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  const isEmpty = !conversation || conversation.messages.length === 0

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-dark-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-dark-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-dark-100 truncate">
            {conversation?.title || 'New Chat'}
          </h2>
          <p className="text-xs text-dark-500">
            {isLoading ? 'Thinking...' : 'Mimo v2.5 Pro'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800 text-xs text-dark-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Online
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {isEmpty ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-600/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-100 mb-2">
                How can I help you today?
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed">
                I&apos;m powered by Mimo v2.5 Pro. Ask me anything — from coding questions
                to creative writing, analysis, or general knowledge.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { icon: '💡', text: 'Explain quantum computing' },
                  { icon: '🎨', text: 'Write a poem about AI' },
                  { icon: '💻', text: 'Debug my Python code' },
                  { icon: '📊', text: 'Analyze this dataset' },
                ].map((suggestion) => (
                  <button
                    key={suggestion.text}
                    onClick={() => onSendMessage(suggestion.text)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-dark-800/50 hover:bg-dark-800 border border-dark-700 hover:border-dark-600 text-left text-sm text-dark-300 hover:text-dark-100 transition-all duration-200"
                  >
                    <span>{suggestion.icon}</span>
                    <span className="line-clamp-1">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full">
            {conversation?.messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && conversation?.messages[conversation.messages.length - 1]?.role === 'user' && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-dark-700 bg-dark-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto w-full px-4 py-4">
          <ChatInput
            onSend={onSendMessage}
            isLoading={isLoading}
            placeholder={isEmpty ? 'Type your message...' : 'Continue the conversation...'}
          />
          <p className="text-center text-xs text-dark-600 mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </main>
  )
}

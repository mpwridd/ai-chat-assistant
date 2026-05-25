'use client'

import { Message } from '@/types'
import { formatTimestamp, cn } from '@/lib/utils'
import { MarkdownRenderer } from './MarkdownRenderer'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'px-4 py-6 animate-fade-in',
        isUser ? 'bg-transparent' : 'bg-dark-900/50'
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center',
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
              : 'bg-gradient-to-br from-accent to-purple-600'
          )}
        >
          {isUser ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-dark-200">
              {isUser ? 'You' : 'Mimo'}
            </span>
            <span className="text-xs text-dark-600">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          <div className="mt-1">
            {isUser ? (
              <p className="text-dark-100 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>

          {/* Copy button for assistant messages */}
          {!isUser && message.content && (
            <button
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

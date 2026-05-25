'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  placeholder?: string
}

export function ChatInput({ onSend, isLoading, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [message, adjustHeight])

  const handleSubmit = () => {
    const trimmed = message.trim()
    if (!trimmed || isLoading) return
    
    onSend(trimmed)
    setMessage('')
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative">
      <div className="flex items-end gap-3 p-3 rounded-xl bg-dark-800 border border-dark-600 focus-within:border-accent/50 transition-colors">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type your message...'}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-dark-100 placeholder:text-dark-500 resize-none outline-none min-h-[24px] max-h-[200px] py-0.5 text-sm leading-relaxed"
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg transition-all duration-200',
            message.trim() && !isLoading
              ? 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25'
              : 'bg-dark-700 text-dark-500 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

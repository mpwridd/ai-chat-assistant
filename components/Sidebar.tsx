'use client'

import { Conversation } from '@/types'
import { formatTimestamp, cn } from '@/lib/utils'

interface SidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function Sidebar({
  conversations,
  activeConversationId,
  isOpen,
  onToggle,
  onNewChat,
  onSelect,
  onDelete,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-dark-900 border-r border-dark-700 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-dark-50">AI Assistant</h1>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-dark-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dark-600 hover:border-accent hover:bg-dark-800 text-dark-200 hover:text-dark-50 transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 text-dark-400 group-hover:text-accent transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-4">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group relative',
                  conversation.id === activeConversationId
                    ? 'bg-dark-800 text-dark-50'
                    : 'text-dark-300 hover:bg-dark-800/50 hover:text-dark-100'
                )}
              >
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-dark-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conversation.title}</p>
                  <p className="text-xs text-dark-500 mt-0.5">
                    {formatTimestamp(conversation.updatedAt)}
                  </p>
                </div>
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conversation.id)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/20 text-dark-500 hover:text-red-400 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </button>
            ))}
          </div>

          {conversations.length === 0 && (
            <div className="text-center py-8 text-dark-500">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Click &quot;New Chat&quot; to start</p>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-2 text-xs text-dark-500">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Powered by Mimo v2.5 Pro</span>
          </div>
        </div>
      </aside>
    </>
  )
}

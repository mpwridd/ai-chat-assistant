'use client'

export function TypingIndicator() {
  return (
    <div className="px-4 py-6 bg-dark-900/50 animate-fade-in">
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-accent to-purple-600">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Typing dots */}
        <div className="flex items-center gap-1">
          <div className="typing-dot w-2 h-2 rounded-full bg-dark-400" />
          <div className="typing-dot w-2 h-2 rounded-full bg-dark-400" />
          <div className="typing-dot w-2 h-2 rounded-full bg-dark-400" />
        </div>
      </div>
    </div>
  )
}

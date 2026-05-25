'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match && !className
            
            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <div className="relative group">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      const text = String(children).replace(/\n$/, '')
                      navigator.clipboard.writeText(text)
                    }}
                    className="px-2 py-1 rounded text-xs bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-dark-100 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

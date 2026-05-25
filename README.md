# AI Chat Assistant

A beautiful, production-ready AI chat application built with Next.js 14, TypeScript, and Tailwind CSS. Powered by the Mimo v2.5 Pro API.

![AI Chat Assistant](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- 🎨 **Beautiful Dark UI** - Sleek, modern dark theme with smooth animations
- 💬 **Multi-turn Conversations** - Full chat history with context preservation
- 📱 **Mobile Responsive** - Works seamlessly on all device sizes
- 📝 **Markdown Support** - Rich text rendering with syntax highlighting
- 🗂️ **Conversation Management** - Create, switch, and delete conversations
- ⚡ **Streaming Responses** - Real-time token-by-token response streaming
- 🎯 **Smart Sidebar** - Organized conversation list with timestamps
- 📋 **Copy Messages** - One-click copy for any message
- ⌨️ **Keyboard Shortcuts** - Enter to send, Shift+Enter for new lines

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Mimo v2.5 Pro
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Deployment**: Vercel-ready (standalone output)

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Mimo API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-chat-assistant.git
cd ai-chat-assistant
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Mimo API key:

```env
MIMO_API_KEY=your_api_key_here
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
ai-chat-assistant/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # API route for chat completions
│   ├── globals.css            # Global styles and Tailwind imports
│   ├── layout.tsx             # Root layout with fonts and metadata
│   └── page.tsx               # Main chat page with state management
├── components/
│   ├── ChatArea.tsx           # Main chat area with messages
│   ├── ChatInput.tsx          # Message input with auto-resize
│   ├── MarkdownRenderer.tsx   # Markdown rendering with syntax highlighting
│   ├── MessageBubble.tsx      # Individual message component
│   ├── Sidebar.tsx            # Conversation list sidebar
│   └── TypingIndicator.tsx    # Typing animation
├── lib/
│   ├── api.ts                 # API client utilities
│   └── utils.ts               # Helper functions
├── types/
│   └── index.ts               # TypeScript type definitions
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## API Configuration

The app uses the Mimo v2.5 Pro API with OpenAI-compatible format:

- **Endpoint**: `http://100.91.112.121:8317/v1/chat/completions`
- **Model**: `Mimo-V2.5-Pro`
- **Streaming**: Supported (enabled by default)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MIMO_API_KEY` | Your Mimo API key | Yes |
| `MIMO_API_URL` | Custom API endpoint (optional) | No |

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

The app is configured with `output: 'standalone'` for optimal deployment.

### Build for Production

```bash
npm run build
npm start
```

## Customization

### Changing the Theme

Edit `tailwind.config.ts` to customize colors:

```typescript
theme: {
  extend: {
    colors: {
      dark: {
        // Your custom dark palette
      },
      accent: {
        // Your accent colors
      },
    },
  },
},
```

### Adding System Prompts

To add a system prompt, modify the `messages` array in `app/api/chat/route.ts`:

```typescript
const systemMessage = {
  role: 'system',
  content: 'You are a helpful AI assistant...',
}

body: JSON.stringify({
  messages: [systemMessage, ...messages],
  // ...
}),
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Powered by [Mimo v2.5 Pro](https://mimo.ai)

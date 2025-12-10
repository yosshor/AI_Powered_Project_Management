# 🚀 AI-Powered Project Management

A modern, intelligent project management application built with React, TypeScript, and Convex. Features AI-powered task generation and project assistance powered by Google Gemini.

## ✨ Features

- **📋 Project Management** - Create and organize multiple projects with descriptions
- **✅ Task Tracking** - Manage tasks with status (TODO, IN_PROGRESS, DONE)
- **🤖 AI Assistant** - Chat with an AI assistant about your projects
- **✨ AI Task Generation** - Automatically generate tasks from project descriptions
- **💾 Real-time Sync** - Powered by Convex for instant data synchronization
- **🎨 Modern UI** - Beautiful, responsive interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Convex (real-time database & backend)
- **AI**: Google Gemini API
- **UI**: Tailwind CSS, Lucide Icons

## 📦 Prerequisites

- Node.js (v20.19.0 or >=22.12.0)
- npm or yarn
- Google Gemini API key

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_CONVEX_URL="http://localhost:8187"
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Start Convex Development Server

In one terminal, start the Convex backend:

```bash
npx convex dev
```

This will:
- Create a Convex project (if needed)
- Start the development server
- Provide you with a deployment URL

### 4. Start the Development Server

In another terminal, start the Vite dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## 📁 Project Structure

```
├── components/          # React components
│   ├── AIChat.tsx      # AI chat interface
│   ├── ProjectList.tsx # Project sidebar
│   └── TaskBoard.tsx   # Task management board
├── convex/             # Convex backend functions
│   ├── projects.ts     # Project CRUD operations
│   ├── tasks.ts        # Task CRUD operations
│   ├── messages.ts     # Chat message operations
│   └── schema.ts       # Database schema
├── lib/                # Utility files
│   └── convexClient.ts # Convex client configuration
├── services/           # External services
│   └── gemini.ts       # Gemini AI integration
└── types.ts            # TypeScript type definitions
```

## 🎯 Usage

1. **Create a Project**: Click the "+" button in the sidebar and fill in the project details
2. **Generate Tasks**: Use the "פרק משימות עם AI" button to auto-generate tasks from your project description
3. **Manage Tasks**: Click on task status icons to update progress (TODO → IN_PROGRESS → DONE)
4. **Chat with AI**: Use the chat panel on the right to ask questions about your project

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build


---

Built with ❤️ using React, Convex, and Google Gemini By Yossi Shor


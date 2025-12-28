# opencode

A powerful CLI Tool & AI Agent Framework designed to assist with coding, debugging, refactoring, and project management using Large Language Models (LLMs).

## Overview

- **Runtime**: Built on [Bun](https://bun.sh) (TypeScript ESM).
- **AI Integration**: Supports major LLM providers (OpenAI, Anthropic, Google, Bedrock, etc.) via Vercel AI SDK.
- **Protocols**: Implements MCP (Model Context Protocol) and ACP (Agent Client Protocol).
- **Interface**: Features a rich Terminal User Interface (TUI) for interactive coding sessions.
- **Architecture**: Layered architecture with CLI, Server, Session, Tool, and Provider layers.

## Architecture Overview

```
┌─────────────────────────────────────┐
│         CLI Layer                   │  Command parsing, UI, TUI
├─────────────────────────────────────┤
│         Server Layer                │  Hono HTTP, WebSocket, SSE
├─────────────────────────────────────┤
│         Session Layer               │  AI conversations, messages
├─────────────────────────────────────┤
│         Tool Layer                  │  Bash, File ops, LSP, etc.
├─────────────────────────────────────┤
│         Provider Layer              │  Multi-LLM support
└─────────────────────────────────────┘
```

## Key Features

### Multi-Provider Support

- **20+ AI Providers**: OpenAI, Anthropic, Google (Gemini/Vertex), Amazon Bedrock, Azure, OpenRouter, Groq, DeepInfra, Cerebras, and more
- **Automatic API Key Detection**: From environment variables or config
- **Cost Tracking**: Per-model token usage and cost calculation
- **Dynamic Loading**: Providers loaded on-demand

### Advanced Tool System

- **30+ Built-in Tools**: Bash execution, file operations, LSP integration, web fetch, etc.
- **MCP Tool Integration**: Load tools from Model Context Protocol servers
- **Permission System**: User approval for sensitive operations
- **Parallel Execution**: Multiple tools can run concurrently

### Session Management

- **Conversation History**: Full message persistence with parts (text, tool calls, reasoning)
- **Session Forking**: Branch from any point in conversation
- **Context Compaction**: AI-powered summarization to fit context limits
- **Revert/Unrevert**: Undo changes and restore previous state
- **Session Sharing**: Generate shareable links for sessions

### Developer Experience

- **LSP Integration**: Code intelligence via Language Server Protocol
- **Git Integration**: Version control awareness
- **File Watching**: Real-time change detection
- **Snapshot System**: Track file changes per session
- **OAuth Flows**: Secure authentication for providers

## Project Structure

```
packages/opencode/
├── bin/
│   └── opencode              # CLI entry point
├── src/
│   ├── index.ts              # Application bootstrap
│   ├── cli/                  # Command Line Interface
│   │   ├── cmd/              # Command implementations (run, auth, serve, etc.)
│   │   └── ui.ts             # UI components
│   ├── session/              # AI Session Management
│   │   ├── index.ts          # Session CRUD operations
│   │   ├── message-v2.ts     # Message handling
│   │   ├── prompt.ts         # Prompt processing & LLM integration
│   │   ├── compaction.ts     # Context compression
│   │   └── revert.ts         # Session revert logic
│   ├── tool/                 # Tool System
│   │   ├── bash.ts           # Shell command execution
│   │   ├── read.ts           # File reading
│   │   ├── edit.ts           # File editing
│   │   ├── write.ts          # File writing
│   │   ├── glob.ts           # File pattern matching
│   │   ├── grep.ts           # Content search
│   │   ├── task.ts           # Task delegation to sub-agents
│   │   └── registry.ts       # Tool registration system
│   ├── provider/             # LLM Provider Integration
│   │   ├── provider.ts       # Provider management
│   │   ├── models.ts         # Model definitions
│   │   └── auth.ts           # Provider authentication
│   ├── server/               # HTTP Server (Hono)
│   │   ├── server.ts         # REST API endpoints
│   │   ├── tui.ts            # TUI-specific routes
│   │   └── project.ts        # Project management routes
│   ├── mcp/                  # Model Context Protocol
│   │   ├── index.ts          # MCP client implementation
│   │   └── oauth-provider.ts # OAuth for MCP servers
│   ├── acp/                  # Agent Client Protocol
│   │   ├── agent.ts          # ACP agent implementation
│   │   └── session.ts        # ACP session management
│   ├── config/               # Configuration
│   ├── file/                 # File utilities
│   ├── lsp/                  # Language Server Protocol
│   ├── project/              # Project management
│   ├── storage/              # Persistent storage
│   └── util/                 # Utilities
└── test/                     # Test suite
```

## Core Workflows

### Session Lifecycle

```typescript
// 1. Create a new session
const session = await Session.create({ title: "My Coding Session" })

// 2. Send a prompt to the AI
await SessionPrompt.prompt({
  sessionID: session.id,
  parts: [{ type: "text", text: "Refactor this function" }],
  model: { providerID: "anthropic", modelID: "claude-sonnet-4" },
  agent: "general",
})

// 3. AI executes tools automatically (bash, read, edit, etc.)
// 4. Results streamed back to client via SSE/WebSocket
// 5. Session persisted with full history
```

### Tool Execution

Tools are executed automatically by the AI when needed:

```typescript
// Example: AI calls bash tool
{
  type: "tool",
  tool: "bash",
  input: { command: "npm test" }
}

// Tool executes and returns result
{
  type: "tool_result",
  output: "All tests passed ✓"
}
```

### Available Tools

| Tool        | Description                              |
| ----------- | ---------------------------------------- |
| `bash`      | Execute shell commands                   |
| `read`      | Read file contents                       |
| `edit`      | Edit files with exact string replacement |
| `write`     | Write/create files                       |
| `glob`      | Find files by pattern                    |
| `grep`      | Search file contents                     |
| `patch`     | Apply code patches                       |
| `task`      | Delegate to specialized sub-agents       |
| `webfetch`  | Fetch web content                        |
| `lsp`       | Language Server Protocol operations      |
| `todowrite` | Task list management                     |

## API Endpoints

The server exposes a REST API (default port varies):

### Session Management

```
POST   /session                    # Create new session
GET    /session                    # List all sessions
GET    /session/:id                # Get session details
PATCH  /session/:id                # Update session
DELETE /session/:id                # Delete session
POST   /session/:id/message        # Send message to session
POST   /session/:id/abort          # Abort running session
POST   /session/:id/fork           # Fork session at message
POST   /session/:id/share          # Create shareable link
```

### Configuration & Providers

```
GET    /config                     # Get configuration
PATCH  /config                     # Update configuration
GET    /provider                   # List available providers
GET    /config/providers           # List configured providers
POST   /provider/:id/oauth/authorize  # Start OAuth flow
```

### File Operations

```
GET    /file                       # List files
GET    /file/content               # Read file
GET    /file/status                # Git status
GET    /find                       # Search text in files
GET    /find/file                  # Find files by name
```

### MCP (Model Context Protocol)

```
GET    /mcp                        # MCP server status
POST   /mcp/connect                # Connect to MCP server
POST   /mcp/disconnect             # Disconnect MCP server
```

## Configuration

OpenCode can be configured via `~/.config/opencode/config.yaml`:

```yaml
# Default model
model: anthropic/claude-sonnet-4

# Small model for simple tasks (title generation, etc.)
small_model: anthropic/claude-haiku-4-5

# Provider configurations
provider:
  anthropic:
    name: Anthropic
    options:
      apiKey: ${ANTHROPIC_API_KEY}

  openai:
    name: OpenAI
    options:
      apiKey: ${OPENAI_API_KEY}

# MCP Servers
mcp:
  filesystem:
    type: local
    command: ["npx", "-y", "@modelcontextprotocol/server-filesystem"]
    enabled: true

  web-search:
    type: remote
    url: https://mcp.example.com
    oauth: false
    enabled: true

# Session sharing
share: auto # auto | manual | disabled

# Disabled providers (optional)
disabled_providers:
  - some-provider

# Enabled providers (optional, if set only these are enabled)
enabled_providers:
  - anthropic
  - openai
```

## Development

### Prerequisites

- [Bun](https://bun.sh) v1.2.12+

### Setup & Installation

```bash
# Clean install
rm -rf bun.lockb bun.lock node_modules
bun install

# Update Bun to latest version
bun upgrade
```

### Running Locally

```bash
# Run directly
bun run src/index.ts

# Development mode
bun run dev

# With specific command
bun run src/index.ts run "write a hello world function"
```

### Building & Local Installation

```bash
# Build and install locally
./build-and-replace.sh

# Or manually
bun run build
```

### Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test test/session/session.test.ts

# Run tests with coverage
bun test --coverage

# Type checking
bun run typecheck
```

### Code Style

Following best practices from `STYLE_GUIDE.md`:

```typescript
// ✅ Good
const result = calculate()
if (condition) return value

// ❌ Avoid
const { value } = result // Unnecessary destructuring
if (condition) {
  return value
} else {
  // Avoid else
  return other
}

// Preferences:
// - Use Bun APIs over Node.js
// - Prefer single-word variable names
// - Use const over let
// - Avoid any type
// - Minimize try/catch blocks
```

### Git Workflow

```bash
# Pull latest changes
git pull origin dev

# Push changes (example branch)
git push origin son.ct1 --no-verify
```

## Technologies Used

### Core

- **Bun**: Fast JavaScript runtime
- **TypeScript**: Type-safe development
- **Zod**: Runtime type validation
- **Hono**: Fast web framework

### AI & Protocols

- **Vercel AI SDK**: Multi-provider LLM integration
- **@modelcontextprotocol/sdk**: MCP implementation
- **@agentclientprotocol/sdk**: ACP implementation

### Tools & Utilities

- **yargs**: CLI argument parsing
- **@parcel/watcher**: File system watching
- **tree-sitter**: Code parsing
- **vscode-jsonrpc**: LSP communication
- **ripgrep**: Fast code search

## Supported AI Providers

| Provider       | Models                     | Notes                                |
| -------------- | -------------------------- | ------------------------------------ |
| OpenAI         | GPT-4, GPT-5               | Full support                         |
| Anthropic      | Claude Sonnet, Opus, Haiku | Full support with prompt caching     |
| Google         | Gemini, Vertex AI          | Full support                         |
| Amazon Bedrock | Nova, Claude, etc.         | Region-aware model selection         |
| Azure OpenAI   | GPT models                 | Full support                         |
| OpenRouter     | Various                    | Unified access to multiple providers |
| xAI            | Grok                       | Full support                         |
| Groq           | Fast inference             | Full support                         |
| DeepInfra      | Various                    | Full support                         |
| Cerebras       | Fast inference             | Full support                         |

## Event System

OpenCode uses an event-driven architecture:

```typescript
// Subscribe to events
Bus.subscribe(Session.Event.Created, (event) => {
  console.log("New session:", event.info.id)
})

// Global events (cross-project)
GlobalBus.on("event", (event) => {
  console.log("Global event:", event.payload.type)
})
```

## Storage

Hierarchical key-value storage:

```typescript
// Session data
["session", projectID, sessionID]        # Session metadata
["message", sessionID, messageID]        # Message data
["part", messageID, partID]              # Message parts
["share", sessionID]                     # Share configuration
["session_diff", sessionID]              # File changes
```

## License

See LICENSE file for details.

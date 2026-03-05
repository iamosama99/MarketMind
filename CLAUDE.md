# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

MarketMind is a Next.js 16 + React 19 financial intelligence terminal. It has a Bloomberg-style UI with an AI chat system that streams responses and renders interactive financial components inline.

### Data Flow

1. **User query** → `CommandInput` → `POST /api/chat`
2. **LangGraph pipeline** (if `OPENAI_API_KEY` is set): Supervisor → routes to Quantitative / Qualitative / Research agents → Synthesis agent produces an enriched system prompt
3. **AI SDK `streamText`** uses the enriched system prompt + tool definitions to stream a response
4. **Generative UI**: when the LLM calls a tool (e.g. `showSectorAnalysis`), the client renders the matching React component from `COMPONENT_REGISTRY`
5. **Fallback**: if no OpenAI key, uses `FALLBACK_SYSTEM_PROMPT` with direct market data — also supports local Ollama

### Key Files

| Path | Purpose |
|---|---|
| `src/app/api/chat/route.ts` | Main chat endpoint — provider selection, LangGraph invocation, streamText |
| `src/app/api/graphql/route.ts` | GraphQL API via graphql-yoga (sectors, earnings, indices, news) |
| `src/lib/agents/graph.ts` | LangGraph `StateGraph` assembly and conditional routing logic |
| `src/lib/agents/state.ts` | Shared `MarketMindState` annotation schema for the agent pipeline |
| `src/lib/agents/supervisor.ts` | Classifies query into `QUANTITATIVE/QUALITATIVE/MIXED/RESEARCH/FULL/DIRECT` |
| `src/lib/agents/quantitative.ts` | Fetches market data via the GraphQL API |
| `src/lib/agents/qualitative.ts` | Sentiment analysis via LLM |
| `src/lib/agents/research.ts` | RAG retrieval from vector store |
| `src/lib/agents/synthesis.ts` | Combines all agent outputs into a final system prompt |
| `src/lib/vector-store.ts` | Tiered store: Pinecone → in-memory (OpenAI embeddings) → keyword fallback |
| `src/lib/knowledge-base.ts` | Static research documents indexed by the vector store |
| `src/lib/market-data.ts` | In-memory market data (sectors, earnings, indices, news) for US + Indian markets |
| `src/lib/schemas.ts` | Zod schemas for all tool inputs; TypeScript output types for components |
| `src/lib/component-registry.tsx` | Maps tool name strings → React components for Generative UI rendering |
| `src/lib/graphql-client.ts` | `@urql/core` client used by quantitative agent to query `/api/graphql` |
| `src/lib/queries.ts` | GraphQL query strings |

### Generative UI Pattern

Tools are defined in `getToolDefinitions()` in `route.ts` with Zod input schemas from `src/lib/schemas.ts`. When the LLM calls a tool, the AI SDK streams a tool-call part. The client (`MarketFeed`) reads the stream and looks up the tool name in `COMPONENT_REGISTRY` to render the appropriate component. To add a new tool:
1. Add a Zod schema to `schemas.ts`
2. Add tool definition + `execute()` to `getToolDefinitions()` in `route.ts`
3. Create a component in `src/components/generative/`
4. Register it in `component-registry.tsx`

### LangGraph Agent Pipeline

The `MarketMindState` (LangGraph `Annotation.Root`) carries: `currentQuery`, `routingDecision`, `graphqlData`, `sentimentAnalysis`, `retrievedChunks`, `synthesisPrompt`, and `agentPipeline`. The Supervisor agent classifies the query type; conditional edges route through only the relevant agents. The Synthesis agent combines all data into a system prompt string that is passed to `streamText`.

### Vector Store Tiers

`getVectorStore()` selects the implementation based on env vars:
- `PINECONE_API_KEY` → Pinecone (production)
- `OPENAI_API_KEY` only → In-memory with OpenAI `text-embedding-3-small` embeddings (1536 dims, index name `marketmind-research`)
- Neither → Keyword-based fallback (no embeddings needed)

### Environment Variables

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | Enables LangGraph pipeline, OpenAI models, and in-memory embeddings |
| `OPENAI_MODEL` | Override model (default: `gpt-4o`) |
| `PINECONE_API_KEY` | Use Pinecone instead of in-memory vector store |
| `OLLAMA_BASE_URL` | Ollama endpoint (default: `http://localhost:11434/v1`) |
| `OLLAMA_MODEL` | Ollama model (default: `llama3.1`) |

### UI Layout

`src/app/page.tsx` defines a CSS Grid terminal layout (`app-shell` / `terminal-grid`) with named grid areas: `ticker-area`, `heatmap-area`, `feed-area`, `input-area`, `status-area`. Styling is split between `globals.css` (grid/layout/terminal theme) and per-component `.module.css` files.

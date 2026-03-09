# CLAUDE.md

This file provides system architecture guidelines, coding conventions, and strict rules to Claude (claude.ai/code) when working in the `MarketMind` repository.

## Commands

```bash
npm run dev           # Start development server (localhost:3000)
npm run build         # Production build
npm run lint          # Run ESLint
npm run test          # Run unit tests (Vitest)
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Architecture

MarketMind is a Next.js 16 + React 19 financial intelligence terminal. It has a Bloomberg-style UI with an AI chat system that streams responses and renders interactive financial components inline.

### Data Flow

1. **User query** → `CommandInput` (disabled until API key set) → `POST /api/chat` with `X-Api-Key` header
2. **LangGraph pipeline** (if OpenAI key available via BYOK or env): Supervisor routes to Quantitative / Qualitative / Research agents → Synthesis agent produces an enriched system prompt. See `docs/phases/Phase-3-LangGraph-Agents.md`.
3. **AI SDK `streamText`** uses the enriched system prompt + tool definitions to stream a response.
4. **Generative UI**: when the LLM calls a tool (e.g., `showSectorAnalysis`), the client renders the matching React component from `COMPONENT_REGISTRY`. See `docs/phases/Phase-2-Generative-UI.md`.
5. **Fallback / BYOK**: If no OpenAI key, uses `FALLBACK_SYSTEM_PROMPT` with direct market data — also supports local Ollama. User provides their OpenAI API key via a UI modal; key stored in `localStorage`, sent as `X-Api-Key` request header, never logged server-side.

### Directory Conventions

When navigating or extending the codebase, follow these location guidelines instead of predicting static file names:

| Directory/Concept | Location & Purpose |
|-------------------|--------------------|
| **API Routes** | `src/app/api/` — Contains Next.js App Router endpoints (`/chat`, `/graphql`, `/data-status`). |
| **LangGraph Agents** | `src/lib/agents/` — State definition, Graph assembly (`graph.ts`), and individual agent nodes (Supervisor, Quantitative, Qualitative, Synthesis, Research). |
| **Generative Tools** | `src/lib/schemas.ts` (Zod validation), `src/lib/component-registry.tsx` (Component mapping), `src/app/api/chat/route.ts` (Tool execution definitions). |
| **React Components** | `src/components/generative/` — Functional React components spawned by the AI. |
| **Market Data Layer** | `src/lib/` — Contains hybrid fetchers (`market-data-live.ts`, `market-data.ts`), GraphQL clients (`graphql-client.ts`), and caching layers (`cache.ts`). |
| **Vector DB / RAG**| `src/lib/vector-store.ts`, `src/lib/knowledge-base.ts` — Implements the tiered Pinecone → In-Memory → Keyword fallback logic. See `docs/phases/Phase-4-Extensibility.md`. |
| **Global Providers**| `src/lib/*-context.tsx` — Contains BYOK API key context (`api-key-context.tsx`) and the AI SDK single-instance chat context (`chat-context.tsx`). |

### Generative UI Workflow

To add a new tool, strictly follow these steps:
1. Add a Zod schema to `src/lib/schemas.ts`.
2. Add the tool definition and `execute()` logic to `getToolDefinitions()` in `src/app/api/chat/route.ts`.
3. Create the UI Component in `src/components/generative/`. Use `shadcn/ui`, `lucide-react`, and Tailwind classes.
4. Register the new component in `src/lib/component-registry.tsx`.

## Coding Guidelines

When writing or modifying code, adhere to these standards:

- **Styling:** Use Tailwind CSS v4. Avoid creating new `.module.css` files unless absolutely necessary. Rely on utility classes within components.
- **Components:** Create functional React 19 components. Use Server Components by default; add `"use client"` at the top of the file *only* if hooks (`useState`, `useChatContext`, `useEffect`) or interactability are required.
- **Icons:** Exclusively use `lucide-react`.
- **Validation:** Always use `zod` for API boundaries, user inputs, and AI Tool schemas. Strongly type all GraphQL requests.

## Testing Guidelines

When writing tests:
- Place test files alongside the source files using the `*.test.ts` or `*.test.tsx` naming convention (e.g., `src/lib/agents/supervisor.test.ts`).
- Mock complex external layers like Upstash Redis, Pinecone, or live Finnhub API calls to prevent brittle network-dependent tests.

## Strict Rules & Guardrails
> 🚨 **CRITICAL: NEVER VIOLATE THESE RULES**

1. **API Keys:** **NEVER** log `X-Api-Key` or the user's explicit OpenAI keys server-side or to the console.
2. **Layout Preservation:** **DO NOT** modify the CSS Grid definitions in `src/app/globals.css` (specifically `app-shell` and `terminal-grid`) without explicit user permission. Doing so breaks the primary "Bloomberg Terminal" aesthetic.
3. **Typing:** **DO NOT** use `any` types. Provide strict type definitions for GraphQL responses, Agent State schemas, and component props derived from Zod.

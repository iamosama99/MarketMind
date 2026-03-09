# MarketMind

A Bloomberg-style financial intelligence terminal built with Next.js 16, React 19, and a multi-agent AI pipeline. Features streaming AI chat with generative UI — the AI renders interactive financial components inline as it responds.

## Features

- **AI Chat Terminal** — streaming responses via Vercel AI SDK with inline generative UI components
- **Multi-Agent Pipeline** — LangGraph orchestrates Supervisor, Quantitative, Qualitative, Research, and Synthesis agents
- **Generative UI** — AI tool calls render React components (sector analysis, earnings tables, market overviews) directly in the chat feed
- **Dual-Market Coverage** — US (S&P 500, Nasdaq, Dow Jones) and Indian (Nifty 50, Bank Nifty, Sensex) markets
- **BYOK (Bring Your Own Key)** — users provide their OpenAI API key via a UI modal; stored in `localStorage`, never logged server-side
- **Hybrid Data Layer** — live market data from Finnhub API with in-memory mock fallback
- **Vector Store RAG** — Pinecone-backed research retrieval with in-memory and keyword fallbacks
- **GraphQL API** — query sectors, earnings, indices, and news

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS Modules |
| AI/LLM | Vercel AI SDK, LangChain, LangGraph |
| Data | GraphQL (graphql-yoga + URQL), Finnhub API |
| Vector Store | Pinecone (with in-memory fallback) |
| Rate Limiting | Upstash Redis |
| UI Components | Radix UI (shadcn/ui), Lucide React, Recharts |
| Testing | Vitest |

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- An OpenAI API key (or local Ollama instance)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Environment Variables

See [.env.example](.env.example) for all available options. At minimum, set one AI provider:

```env
# Option A: OpenAI (enables full LangGraph multi-agent pipeline)
OPENAI_API_KEY=sk-...

# Option B: Local Ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.1
```

Optional services:

| Variable | Purpose |
|----------|---------|
| `FINNHUB_API_KEY` | Live market data (falls back to mock data) |
| `PINECONE_API_KEY` | Vector store for RAG (falls back to in-memory) |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | Rate limiting |
| `NEXT_PUBLIC_LLM_LABEL` | Model name shown in UI status bar |

Users can also provide their OpenAI key at runtime via the BYOK modal in the UI.

## Scripts

```bash
npm run dev           # Start development server (localhost:3000)
npm run build         # Production build
npm run lint          # Run ESLint
npm run test          # Run unit tests (Vitest)
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — sector heatmap, market feed, AI chat |
| `/terminal` | AI Terminal — full chat interface |
| `/sectors` | Sector heatmap (full-screen) |
| `/news` | Live news feed with sentiment indicators and infinite scroll |
| `/us-markets` | US market sector analysis |
| `/indian-markets` | Indian market sector analysis |

## Architecture

### Data Flow

1. User query enters via `CommandInput` → `POST /api/chat` with `X-Api-Key` header
2. LangGraph pipeline: Supervisor routes to Quantitative / Qualitative / Research agents → Synthesis agent produces an enriched system prompt
3. AI SDK `streamText` streams a response using the enriched prompt + tool definitions
4. When the AI calls a tool (e.g., `showSectorAnalysis`), the client renders the matching React component inline

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Main AI chat — LangGraph pipeline + streaming |
| `/api/graphql` | POST | GraphQL API for market data queries |
| `/api/news` | GET | Paginated news feed |
| `/api/data-status` | GET | Reports live vs mock data source status |

### Generative UI Tools

The AI can call these tools to render interactive components in the chat:

| Tool | Component | Description |
|------|-----------|-------------|
| `showSectorAnalysis` | SectorComparison | Sector comparison table |
| `showEarningsReport` | EarningsTable | Earnings with revenue, EPS, beat/miss |
| `showMarketOverview` | MarketOverview | Market indices display |
| `showMetric` | MetricCard | Single metric highlight |
| `showNews` | NewsFeed | Filtered news display |
| `showResearchSources` | ResearchSources | RAG research documents |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chat endpoint
│   │   ├── graphql/route.ts       # GraphQL API
│   │   ├── news/route.ts          # News feed endpoint
│   │   └── data-status/route.ts   # Data source status
│   ├── terminal/page.tsx          # AI Terminal page
│   ├── sectors/page.tsx           # Sectors page
│   ├── news/page.tsx              # News page
│   ├── us-markets/page.tsx        # US Markets page
│   ├── indian-markets/page.tsx    # Indian Markets page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Dashboard
│   └── globals.css                # Terminal design system
├── components/
│   ├── generative/                # AI-rendered components
│   │   ├── SectorComparison.tsx
│   │   ├── EarningsTable.tsx
│   │   ├── MarketOverview.tsx
│   │   ├── MetricCard.tsx
│   │   ├── NewsFeed.tsx
│   │   └── ResearchSources.tsx
│   ├── ui/                        # shadcn/ui primitives
│   ├── Sidebar.tsx
│   ├── CommandInput.tsx
│   ├── MarketFeed.tsx
│   ├── SectorHeatmap.tsx
│   └── ...
└── lib/
    ├── agents/                    # LangGraph multi-agent pipeline
    │   ├── graph.ts               # StateGraph assembly
    │   ├── supervisor.ts          # Query routing
    │   ├── quantitative.ts        # Market data agent
    │   ├── qualitative.ts         # Sentiment analysis agent
    │   ├── research.ts            # RAG retrieval agent
    │   └── synthesis.ts           # Prompt enrichment agent
    ├── schemas.ts                 # Zod schemas for AI tools
    ├── component-registry.tsx     # Tool name → React component mapping
    ├── market-data-service.ts     # Public data interface (live + mock)
    ├── market-data-live.ts        # Finnhub API fetchers
    ├── market-data.ts             # Mock data (US + India)
    ├── vector-store.ts            # Pinecone + fallback vector store
    ├── knowledge-base.ts          # Research document ingestion
    ├── security.ts                # XSS sanitization, prompt injection detection
    ├── api-key-context.tsx        # BYOK state management
    ├── chat-context.tsx           # AI SDK chat instance
    ├── graphql-client.ts          # URQL client setup
    └── cache.ts                   # In-memory cache with TTL
```

## License

Private

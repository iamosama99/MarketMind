import { streamText, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getMarketSummary, getSectorData, getEarningsReports, getMarketIndices, getMarketNews } from "@/lib/market-data";
import {
    showSectorAnalysisInput,
    showEarningsReportInput,
    showMarketOverviewInput,
    showMetricInput,
    showNewsInput,
    showResearchSourcesInput,
} from "@/lib/schemas";
import { buildMarketMindGraph } from "@/lib/agents/graph";
import { getVectorStore } from "@/lib/vector-store";

export const maxDuration = 60;

// ── Provider Selection ──
function getModel() {
    if (process.env.OPENAI_API_KEY) {
        const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
        return openai(process.env.OPENAI_MODEL || "gpt-4o");
    }

    const ollama = createOpenAI({
        baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
        apiKey: "ollama",
    });
    return ollama(process.env.OLLAMA_MODEL || "llama3.1");
}

// ── Fallback system prompt (used when LangGraph pipeline is skipped) ──
const FALLBACK_SYSTEM_PROMPT = `You are MarketMind, an autonomous market intelligence agent. You are an elite AI financial analyst specializing in identifying how artificial intelligence is disrupting specific market sectors across both US and Indian markets.

Your personality: Direct, data-driven, slightly intense. You speak like a senior analyst at a quantitative hedge fund. Use precise numbers. Reference specific companies and their earnings when relevant. Be provocative in your analysis — don't hedge excessively.

TOOL USAGE — CRITICAL:
- When a user asks about sectors, AI vulnerability, or automation risk, you MUST use the showSectorAnalysis tool to display interactive data.
- When asked about earnings, revenue, or EPS for specific companies, use showEarningsReport.
- When asked about market indices or how a market is performing, use showMarketOverview.
- When you want to highlight a single important metric, use showMetric.
- When asked about news or sentiment, use showNews.
- ALWAYS accompany tool calls with your text analysis. Tools show the data, you provide the insight.
- You can use multiple tools in a single response if relevant.

FORMATTING RULES for text parts:
- Use **bold** for key metrics and company names
- Use bullet points for lists
- Keep paragraphs tight — max 3 sentences each
- End with a clear thesis or actionable insight`;

// ── Shared tool definitions (used by both LangGraph and fallback paths) ──
function getToolDefinitions() {
    return {
        showSectorAnalysis: {
            description:
                "Display an interactive sector analysis panel showing AI vulnerability scores, automation risk, and performance data. Use this when the user asks about sector comparisons, AI disruption, or automation risk rankings.",
            inputSchema: showSectorAnalysisInput,
            execute: async ({ market, limit }: { market?: "US" | "IN"; limit?: number }) => {
                let sectors = getSectorData();
                if (market) sectors = sectors.filter((s) => s.market === market);
                sectors.sort((a, b) => b.aiVulnerability - a.aiVulnerability);
                if (limit) sectors = sectors.slice(0, limit);
                return { sectors };
            },
        },
        showEarningsReport: {
            description:
                "Display an earnings report table showing revenue, EPS, beat/miss status, AI mentions, and price changes. Use this when the user asks about company earnings, revenue, or financial performance.",
            inputSchema: showEarningsReportInput,
            execute: async ({ ticker, sector, market }: { ticker?: string; sector?: string; market?: "US" | "IN" }) => {
                let earnings = getEarningsReports();
                if (ticker) earnings = earnings.filter((e) => e.ticker === ticker || e.ticker.startsWith(ticker));
                if (sector) earnings = earnings.filter((e) => e.sector.toLowerCase().includes(sector.toLowerCase()));
                if (market) earnings = earnings.filter((e) => e.market === market);
                return { earnings };
            },
        },
        showMarketOverview: {
            description:
                "Display a market overview panel showing major indices with current values and changes. Use this when the user asks about market performance, index levels, or how a specific market is doing.",
            inputSchema: showMarketOverviewInput,
            execute: async ({ market }: { market?: "US" | "IN" }) => {
                let indices = getMarketIndices();
                if (market) indices = indices.filter((i) => i.market === market);
                return { indices };
            },
        },
        showMetric: {
            description:
                "Display a single highlighted metric card to draw attention to one important data point. Use this for key takeaways, e.g. 'NVDA revenue beat by 5.95%'.",
            inputSchema: showMetricInput,
            execute: async ({ label, value, change, description }: { label: string; value: string; change: number; description: string }) => {
                return { label, value, change, description };
            },
        },
        showNews: {
            description:
                "Display a filtered news feed showing recent headlines with sentiment and impact indicators. Use this when the user asks about recent news, market sentiment, or sector-specific developments.",
            inputSchema: showNewsInput,
            execute: async ({ sector, sentiment, limit }: { sector?: string; sentiment?: "BULLISH" | "BEARISH" | "NEUTRAL"; limit?: number }) => {
                let news = getMarketNews();
                if (sector) news = news.filter((n) => n.sector.toLowerCase().includes(sector.toLowerCase()));
                if (sentiment) news = news.filter((n) => n.sentiment === sentiment);
                news = news.slice(0, limit ?? 5);
                return { news };
            },
        },
        showResearchSources: {
            description:
                "Display research sources and analyst reports retrieved by the Research Agent. Use this when the Research Agent has found relevant documents, or when the user asks about methodology, deep analysis, or wants sourced insights. Shows document cards with relevance scores.",
            inputSchema: showResearchSourcesInput,
            execute: async ({ query, sector, limit }: { query: string; sector?: string; limit?: number }) => {
                const store = getVectorStore();
                const filter: Record<string, string> = {};
                if (sector) filter.sector = sector;
                const chunks = await store.search(query, limit ?? 3, Object.keys(filter).length > 0 ? filter : undefined);
                return {
                    sources: chunks.map((c) => ({
                        title: c.title,
                        source: c.source,
                        sector: c.sector,
                        market: c.market,
                        content: c.content.slice(0, 500),
                        score: c.score,
                        documentType: c.documentType,
                    })),
                };
            },
        },
    };
}

export async function POST(req: Request) {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    // Extract the latest user message
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === "user");
    const userQuery = lastUserMessage?.content || "";

    let systemPrompt: string;
    let agentPipeline: string[] = [];

    // ── Run LangGraph multi-agent pipeline ──
    // Only run if OpenAI API key is available (LangGraph agents need it)
    if (process.env.OPENAI_API_KEY && userQuery) {
        try {
            const graph = buildMarketMindGraph();

            const result = await graph.invoke({
                currentQuery: userQuery,
            });

            // Use the enriched system prompt from the Synthesis agent
            systemPrompt = result.synthesisPrompt || FALLBACK_SYSTEM_PROMPT;
            agentPipeline = result.agentPipeline || [];

            console.log(`[MarketMind] Agent pipeline: ${agentPipeline.join(" → ")}`);
        } catch (error) {
            console.error("[MarketMind] LangGraph pipeline error, falling back:", error);
            systemPrompt = FALLBACK_SYSTEM_PROMPT + "\n\nCURRENT MARKET DATA:\n" + getMarketSummary();
            agentPipeline = ["⚠️ Fallback"];
        }
    } else {
        // No API key or no query — use fallback
        systemPrompt = FALLBACK_SYSTEM_PROMPT + "\n\nCURRENT MARKET DATA:\n" + getMarketSummary();
        agentPipeline = ["🤖 Direct"];
    }

    // ── Stream the final response using AI SDK ──
    // The LangGraph pipeline enriches the system prompt;
    // streamText handles the actual streaming + tool execution
    const result = streamText({
        model: getModel(),
        system: systemPrompt,
        messages: modelMessages,
        tools: getToolDefinitions(),
        maxOutputTokens: 1500,
        temperature: 0.7,
        headers: {
            "X-Agent-Pipeline": agentPipeline.join(" → "),
        },
    });

    return result.toUIMessageStreamResponse();
}

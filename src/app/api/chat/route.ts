import { streamText, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getMarketSummary, getSectorData, getEarningsReports, getMarketIndices, getMarketNews } from "@/lib/market-data";
import {
    showSectorAnalysisInput,
    showEarningsReportInput,
    showMarketOverviewInput,
    showMetricInput,
    showNewsInput,
} from "@/lib/schemas";

export const maxDuration = 60;

// ── Provider Selection ──
// When OPENAI_API_KEY is set → use OpenAI (gpt-4o)
// Otherwise → use Ollama local LLM via OpenAI-compatible endpoint
function getModel() {
    if (process.env.OPENAI_API_KEY) {
        const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
        return openai(process.env.OPENAI_MODEL || "gpt-4o");
    }

    // Ollama's OpenAI-compatible API
    const ollama = createOpenAI({
        baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
        apiKey: "ollama", // Ollama doesn't need a real key
    });
    return ollama(process.env.OLLAMA_MODEL || "llama3.1");
}

export async function POST(req: Request) {
    const { messages } = await req.json();

    const marketContext = getMarketSummary();

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
        model: getModel(),
        system: `You are MarketMind, an autonomous market intelligence agent. You are an elite AI financial analyst specializing in identifying how artificial intelligence is disrupting specific market sectors across both US and Indian markets.

Your personality: Direct, data-driven, slightly intense. You speak like a senior analyst at a quantitative hedge fund. Use precise numbers. Reference specific companies and their earnings when relevant. Be provocative in your analysis — don't hedge excessively.

You have deep knowledge of:
- US markets: S&P 500, NASDAQ, major tech and financial stocks
- Indian markets: Nifty 50, Nifty IT, Sensex, major IT services companies (TCS, Infosys, Wipro, HCL Tech)
- Cross-market comparisons: Indian IT outsourcing vs US tech, banking sector automation

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
- End with a clear thesis or actionable insight

CURRENT MARKET DATA:
${marketContext}

When analyzing sectors, consider:
1. Which jobs within the sector are most immediately automatable
2. How companies in the sector are responding (investing in AI vs. being disrupted by it)
3. The gap between AI vulnerability score and current stock performance (potential mispricings)
4. Earnings surprise patterns — are companies mentioning AI more or less?
5. Cross-market dynamics — how does AI disruption in US markets affect Indian IT services?`,
        messages: modelMessages,
        tools: {
            showSectorAnalysis: {
                description:
                    "Display an interactive sector analysis panel showing AI vulnerability scores, automation risk, and performance data. Use this when the user asks about sector comparisons, AI disruption, or automation risk rankings.",
                inputSchema: showSectorAnalysisInput,
                execute: async ({ market, limit }) => {
                    let sectors = getSectorData();
                    if (market) {
                        sectors = sectors.filter((s) => s.market === market);
                    }
                    sectors.sort((a, b) => b.aiVulnerability - a.aiVulnerability);
                    if (limit) {
                        sectors = sectors.slice(0, limit);
                    }
                    return { sectors };
                },
            },
            showEarningsReport: {
                description:
                    "Display an earnings report table showing revenue, EPS, beat/miss status, AI mentions, and price changes. Use this when the user asks about company earnings, revenue, or financial performance.",
                inputSchema: showEarningsReportInput,
                execute: async ({ ticker, sector, market }) => {
                    let earnings = getEarningsReports();
                    if (ticker) {
                        earnings = earnings.filter((e) => e.ticker === ticker || e.ticker.startsWith(ticker));
                    }
                    if (sector) {
                        earnings = earnings.filter((e) => e.sector.toLowerCase().includes(sector.toLowerCase()));
                    }
                    if (market) {
                        earnings = earnings.filter((e) => e.market === market);
                    }
                    return { earnings };
                },
            },
            showMarketOverview: {
                description:
                    "Display a market overview panel showing major indices with current values and changes. Use this when the user asks about market performance, index levels, or how a specific market is doing.",
                inputSchema: showMarketOverviewInput,
                execute: async ({ market }) => {
                    let indices = getMarketIndices();
                    if (market) {
                        indices = indices.filter((i) => i.market === market);
                    }
                    return { indices };
                },
            },
            showMetric: {
                description:
                    "Display a single highlighted metric card to draw attention to one important data point. Use this for key takeaways, e.g. 'NVDA revenue beat by 5.95%'.",
                inputSchema: showMetricInput,
                execute: async ({ label, value, change, description }) => {
                    return { label, value, change, description };
                },
            },
            showNews: {
                description:
                    "Display a filtered news feed showing recent headlines with sentiment and impact indicators. Use this when the user asks about recent news, market sentiment, or sector-specific developments.",
                inputSchema: showNewsInput,
                execute: async ({ sector, sentiment, limit }) => {
                    let news = getMarketNews();
                    if (sector) {
                        news = news.filter((n) => n.sector.toLowerCase().includes(sector.toLowerCase()));
                    }
                    if (sentiment) {
                        news = news.filter((n) => n.sentiment === sentiment);
                    }
                    news = news.slice(0, limit ?? 5);
                    return { news };
                },
            },
        },
        maxOutputTokens: 1500,
        temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
}

// ============================================
// MarketMind — Quantitative Agent
// Deterministic data retrieval (no LLM)
// ============================================

import {
    getSectorData,
    getEarningsReports,
    getMarketIndices,
    getMarketNews,
} from "@/lib/market-data-service";
import type { MarketMindStateType } from "./state";

// Keywords that signal which data sources to fetch
const SECTOR_KEYWORDS = ["sector", "vulnerability", "automation", "risk", "disruption", "ai impact", "heatmap"];
const EARNINGS_KEYWORDS = ["earnings", "revenue", "eps", "beat", "miss", "surprise", "financial", "quarter", "q1", "q2", "q3", "q4"];
const INDEX_KEYWORDS = ["index", "indices", "market", "nifty", "sensex", "s&p", "nasdaq", "dow", "performance", "how is", "how are"];
const NEWS_KEYWORDS = ["news", "headline", "sentiment", "latest", "recent", "developments"];

// Company ticker mappings for query parsing
const TICKER_MAP: Record<string, string> = {
    nvidia: "NVDA", nvda: "NVDA",
    tesla: "TSLA", tsla: "TSLA",
    amazon: "AMZN", amzn: "AMZN",
    meta: "META", facebook: "META",
    jpmorgan: "JPM", jpm: "JPM",
    fedex: "FDX", fdx: "FDX",
    lockheed: "LMT", lmt: "LMT",
    unitedhealth: "UNH", unh: "UNH",
    tcs: "TCS.NS",
    infosys: "INFY.NS", infy: "INFY.NS",
    wipro: "WIPRO.NS",
    hcl: "HCLTECH.NS", hcltech: "HCLTECH.NS",
    hdfc: "HDFCBANK.NS",
    reliance: "RELIANCE.NS",
};

function queryMatchesAny(query: string, keywords: string[]): boolean {
    const lower = query.toLowerCase();
    return keywords.some((kw) => lower.includes(kw));
}

function detectMarketFilter(query: string): "US" | "IN" | null {
    const lower = query.toLowerCase();
    if (lower.includes("india") || lower.includes("indian") || lower.includes("nifty") || lower.includes("sensex") || lower.includes("nse")) {
        return "IN";
    }
    if (lower.includes("us ") || lower.includes("american") || lower.includes("s&p") || lower.includes("nasdaq") || lower.includes("dow")) {
        return "US";
    }
    return null;
}

function detectTicker(query: string): string | null {
    const lower = query.toLowerCase();
    for (const [keyword, ticker] of Object.entries(TICKER_MAP)) {
        if (lower.includes(keyword)) return ticker;
    }
    return null;
}

function detectSector(query: string): string | null {
    const lower = query.toLowerCase();
    const sectors = [
        "technology", "tech", "it services", "financial", "banking",
        "transportation", "logistics", "healthcare", "media", "entertainment",
        "manufacturing", "energy", "biotech", "pharma", "defense", "aerospace",
        "retail", "e-commerce", "fmcg", "auto",
    ];
    for (const sector of sectors) {
        if (lower.includes(sector)) return sector;
    }
    return null;
}

export async function quantitativeNode(
    state: MarketMindStateType
): Promise<Partial<MarketMindStateType>> {
    const query = state.currentQuery;
    const marketFilter = detectMarketFilter(query);
    const ticker = detectTicker(query);
    const sector = detectSector(query);

    const data: Record<string, unknown> = {};

    // Fetch sectors if relevant
    if (queryMatchesAny(query, SECTOR_KEYWORDS)) {
        let sectors = await getSectorData();
        if (marketFilter) {
            sectors = sectors.filter((s) => s.market === marketFilter);
        }
        sectors.sort((a, b) => b.aiVulnerability - a.aiVulnerability);
        data.sectors = sectors;
    }

    // Fetch earnings if relevant
    if (queryMatchesAny(query, EARNINGS_KEYWORDS) || ticker) {
        let earnings = await getEarningsReports();
        if (ticker) {
            earnings = earnings.filter((e) => e.ticker === ticker || e.ticker.startsWith(ticker));
        }
        if (sector && !ticker) {
            earnings = earnings.filter((e) => e.sector.toLowerCase().includes(sector));
        }
        if (marketFilter && !ticker) {
            earnings = earnings.filter((e) => e.market === marketFilter);
        }
        data.earnings = earnings;
    }

    // Fetch indices if relevant
    if (queryMatchesAny(query, INDEX_KEYWORDS)) {
        let indices = await getMarketIndices();
        if (marketFilter) {
            indices = indices.filter((i) => i.market === marketFilter);
        }
        data.indices = indices;
    }

    // Fetch news if relevant
    if (queryMatchesAny(query, NEWS_KEYWORDS) || sector) {
        let news = await getMarketNews();
        if (sector) {
            news = news.filter((n) => n.sector.toLowerCase().includes(sector));
        }
        data.news = news;
    }

    // If nothing matched specifically, fetch a broad overview
    if (Object.keys(data).length === 0) {
        data.sectors = await getSectorData();
        data.indices = await getMarketIndices();
        data.news = (await getMarketNews()).slice(0, 5);
    }

    return {
        graphqlData: data,
        completedAgents: ["quantitative"],
        agentPipeline: ["📊 Quantitative"],
    };
}

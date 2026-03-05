// ============================================
// MarketMind — Zod Schemas for Generative UI
// Defines input/output contracts for AI tools
// ============================================

import { z } from "zod";

// ───── Tool Input Schemas ─────

export const showSectorAnalysisInput = z.object({
    market: z.enum(["US", "IN"]).optional().describe("Filter by market. Omit to show all markets."),
    limit: z.number().optional().describe("Max number of sectors to show. Defaults to all."),
});

export const showEarningsReportInput = z.object({
    ticker: z.string().optional().describe("Filter by company ticker, e.g. 'NVDA' or 'TCS.NS'."),
    sector: z.string().optional().describe("Filter by sector name, e.g. 'Technology' or 'IT Services'."),
    market: z.enum(["US", "IN"]).optional().describe("Filter by market."),
});

export const showMarketOverviewInput = z.object({
    market: z.enum(["US", "IN"]).optional().describe("Filter by market. Omit to show all indices."),
});

export const showMetricInput = z.object({
    label: z.string().describe("The metric label, e.g. 'NVDA Revenue'"),
    value: z.string().describe("The metric value, e.g. '$35.1B'"),
    change: z.number().describe("Percentage change, e.g. 5.95 or -2.3"),
    description: z.string().describe("Brief context about what this metric means"),
});

export const showNewsInput = z.object({
    sector: z.string().optional().describe("Filter news by sector name."),
    sentiment: z.enum(["BULLISH", "BEARISH", "NEUTRAL"]).optional().describe("Filter by sentiment."),
    limit: z.number().optional().describe("Max number of news items. Defaults to 5."),
});

export const showResearchSourcesInput = z.object({
    query: z.string().describe("The research query to find relevant sources for."),
    sector: z.string().optional().describe("Filter by sector name."),
    limit: z.number().optional().describe("Max number of sources. Defaults to 3."),
});

// ───── Tool Output Types (for component props) ─────

export type SectorAnalysisOutput = {
    sectors: Array<{
        name: string;
        ticker: string;
        market: string;
        aiVulnerability: number;
        performance: number;
        marketCap: string;
        automationRisk: string;
    }>;
};

export type EarningsReportOutput = {
    earnings: Array<{
        company: string;
        ticker: string;
        sector: string;
        market: string;
        revenue: number;
        revenueEstimate: number;
        eps: number;
        epsEstimate: number;
        beat: boolean;
        surprise: number;
        aiMentions: number;
        priceChange: number;
        date: string;
    }>;
};

export type MarketOverviewOutput = {
    indices: Array<{
        name: string;
        ticker: string;
        market: string;
        value: number;
        change: number;
        changePercent: number;
    }>;
};

export type MetricOutput = {
    label: string;
    value: string;
    change: number;
    description: string;
};

export type NewsOutput = {
    news: Array<{
        id: string;
        headline: string;
        source: string;
        sector: string;
        sentiment: string;
        timestamp: string;
        impact: string;
    }>;
};

export type ResearchSourcesOutput = {
    sources: Array<{
        title: string;
        source: string;
        sector: string;
        market: string;
        content: string;
        score: number;
        documentType: string;
    }>;
};

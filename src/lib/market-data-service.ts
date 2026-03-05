// ============================================
// MarketMind — Market Data Service
// Public interface for all consumers.
// Hybrid: live data where available, mock fallback.
// Re-exports all types so import paths stay valid.
// ============================================

export type {
    SectorData,
    EarningsReport,
    MarketIndex,
    MarketNews,
} from "./market-data";

import {
    getSectorData as getMockSectors,
    getEarningsReports as getMockEarnings,
    getMarketIndices as getMockIndices,
    getMarketNews as getMockNews,
} from "./market-data";

import {
    fetchLiveIndices,
    fetchLiveSectorPerformance,
    fetchLiveEarnings,
    fetchLiveNews,
} from "./market-data-live";

import { cache, TTL } from "./cache";
import type { SectorData, EarningsReport, MarketIndex, MarketNews } from "./market-data";

// ── Data source status ──

export interface DataSourceStatus {
    indices: "live" | "mock";
    sectors: "live" | "mock";
    earnings: "live" | "mock";
    news: "live" | "mock";
    lastUpdated: string;
}

let currentStatus: DataSourceStatus = {
    indices: "mock",
    sectors: "mock",
    earnings: "mock",
    news: "mock",
    lastUpdated: new Date().toISOString(),
};

export function getDataSourceStatus(): DataSourceStatus {
    return { ...currentStatus };
}

// ── getSectorData ──

export async function getSectorData(): Promise<SectorData[]> {
    const cached = cache.get<SectorData[]>("sectors");
    if (cached) return cached;

    const mock = getMockSectors();
    const live = await fetchLiveSectorPerformance(mock);
    if (live) {
        cache.set("sectors", live, TTL.SECTORS);
        currentStatus = { ...currentStatus, sectors: "live", lastUpdated: new Date().toISOString() };
        return live;
    }

    currentStatus = { ...currentStatus, sectors: "mock" };
    return mock;
}

// ── getMarketIndices ──

export async function getMarketIndices(): Promise<MarketIndex[]> {
    const cached = cache.get<MarketIndex[]>("indices");
    if (cached) return cached;

    const mock = getMockIndices();
    const live = await fetchLiveIndices(mock);
    if (live) {
        cache.set("indices", live, TTL.INDICES);
        currentStatus = { ...currentStatus, indices: "live", lastUpdated: new Date().toISOString() };
        return live;
    }

    currentStatus = { ...currentStatus, indices: "mock" };
    return mock;
}

// ── getEarningsReports ──

export async function getEarningsReports(): Promise<EarningsReport[]> {
    const cached = cache.get<EarningsReport[]>("earnings");
    if (cached) return cached;

    const mock = getMockEarnings();
    const live = await fetchLiveEarnings(mock);
    if (live) {
        cache.set("earnings", live, TTL.EARNINGS);
        currentStatus = { ...currentStatus, earnings: "live", lastUpdated: new Date().toISOString() };
        return live;
    }

    currentStatus = { ...currentStatus, earnings: "mock" };
    return mock;
}

// ── getMarketNews ──

export async function getMarketNews(): Promise<MarketNews[]> {
    const cached = cache.get<MarketNews[]>("news");
    if (cached) return cached;

    const mock = getMockNews();
    const live = await fetchLiveNews();
    if (live && live.length > 0) {
        // Live headlines first, then mock's sector-classified items
        const merged = [...live, ...mock].slice(0, 15);
        cache.set("news", merged, TTL.NEWS);
        currentStatus = { ...currentStatus, news: "live", lastUpdated: new Date().toISOString() };
        return merged;
    }

    currentStatus = { ...currentStatus, news: "mock" };
    return mock;
}

// ── getMarketSummary ──
// Async rebuild with real current date and live data

export async function getMarketSummary(): Promise<string> {
    const [sectors, earnings, indices, news] = await Promise.all([
        getSectorData(),
        getEarningsReports(),
        getMarketIndices(),
        getMarketNews(),
    ]);

    const now = new Date().toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });

    const usIndices = indices.filter((i) => i.market === "US");
    const inIndices = indices.filter((i) => i.market === "IN");
    const usSectors = sectors.filter((s) => s.market === "US").sort((a, b) => b.aiVulnerability - a.aiVulnerability);
    const inSectors = sectors.filter((s) => s.market === "IN").sort((a, b) => b.aiVulnerability - a.aiVulnerability);
    const usEarnings = earnings.filter((e) => e.market === "US");
    const inEarnings = earnings.filter((e) => e.market === "IN");

    const fmtChange = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}`;

    return `
CURRENT MARKET DATA (as of ${now}):

US INDICES:
${usIndices.map((i) => `${i.name} (${i.ticker}): ${i.value.toLocaleString()} | ${fmtChange(i.change)} (${fmtChange(i.changePercent)}%)`).join("\n")}

INDIAN INDICES:
${inIndices.map((i) => `${i.name} (${i.ticker}): ${i.value.toLocaleString()} | ${fmtChange(i.change)} (${fmtChange(i.changePercent)}%)`).join("\n")}

SECTOR AI VULNERABILITY RANKINGS (US):
${usSectors.map((s, i) => `${i + 1}. ${s.name} (${s.ticker}) — Vulnerability: ${s.aiVulnerability}/100 [${s.automationRisk}] | Performance: ${fmtChange(s.performance)}%`).join("\n")}

SECTOR AI VULNERABILITY RANKINGS (INDIA):
${inSectors.map((s, i) => `${i + 1}. ${s.name} (${s.ticker}) — Vulnerability: ${s.aiVulnerability}/100 [${s.automationRisk}] | Performance: ${fmtChange(s.performance)}%`).join("\n")}

RECENT EARNINGS (US):
${usEarnings.map((e) => `${e.company} (${e.ticker}): EPS $${e.eps} (est. $${e.epsEstimate}) ${e.beat ? "BEAT" : "MISS"} | AI Mentions: ${e.aiMentions} | Post: ${fmtChange(e.priceChange)}%`).join("\n")}

RECENT EARNINGS (INDIA):
${inEarnings.map((e) => `${e.company} (${e.ticker}): EPS ₹${e.eps} (est. ₹${e.epsEstimate}) ${e.beat ? "BEAT" : "MISS"} | AI Mentions: ${e.aiMentions} | Post: ${fmtChange(e.priceChange)}%`).join("\n")}

LATEST NEWS:
${news.slice(0, 8).map((n) => `[${n.sentiment}] ${n.headline} — ${n.source} (${n.sector})`).join("\n")}
`.trim();
}

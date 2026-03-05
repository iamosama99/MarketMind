// ============================================
// MarketMind — Live Market Data Fetchers
// Yahoo Finance (no key) + Finnhub (optional key)
// Never throws — returns null on any failure.
// ============================================

import type { SectorData, EarningsReport, MarketIndex, MarketNews } from "./market-data";

// ── Yahoo Finance ticker mappings ──
// Maps internal tickers (from market-data.ts) → Yahoo Finance symbols

const INDEX_YF_MAP: Record<string, string> = {
    SPX:        "^GSPC",
    IXIC:       "^IXIC",
    DJI:        "^DJI",
    VIX:        "^VIX",
    NIFTY:      "^NSEI",
    SENSEX:     "^BSESN",
    BANKNIFTY:  "^NSEBANK",
    NIFTYIT:    "^CNXIT",
};

const SECTOR_YF_MAP: Record<string, string> = {
    // US sector ETFs
    XLK: "XLK",
    XLF: "XLF",
    XLV: "XLV",
    XLP: "XLP",
    XLI: "XLI",
    XLE: "XLE",
    XLC: "XLC",
    ITA: "ITA",
    // India — NSE sector indices
    NIFTYIT:     "^CNXIT",
    BANKNIFTY:   "^NSEBANK",
    NIFTYPHARMA: "^CNXPHARMA",
    NIFTYENRG:   "^CNXENERGY",
    NIFTYAUTO:   "^CNXAUTO",
    NIFTYMETAL:  "^CNXMETAL",
    NIFTYREAL:   "^CNXREALTY",
    NIFTYFMCG:   "^CNXFMCG",
    NIFTYMEDIA:  "^CNXMEDIA",
};

// ── Yahoo Finance single-quote fetcher ──

interface YFQuote {
    price: number;
    change: number;
    changePercent: number;
    marketCap?: number;
}

async function fetchYFQuote(yfTicker: string): Promise<YFQuote | null> {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yfTicker)}?interval=1d&range=1d`;
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(3000),
            cache: "no-store",
        });
        if (!res.ok) return null;

        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (!meta?.regularMarketPrice) return null;

        return {
            price: meta.regularMarketPrice,
            change: meta.regularMarketChange ?? 0,
            changePercent: meta.regularMarketChangePercent ?? 0,
            marketCap: meta.marketCap,
        };
    } catch {
        return null;
    }
}

function formatMarketCap(raw: number | undefined, market: "US" | "IN"): string | null {
    if (!raw) return null;
    if (market === "US") {
        if (raw >= 1e12) return `$${(raw / 1e12).toFixed(1)}T`;
        if (raw >= 1e9)  return `$${(raw / 1e9).toFixed(1)}B`;
        return `$${(raw / 1e6).toFixed(0)}M`;
    }
    // Approximate INR conversion: 1 USD ≈ 83 INR
    const inr = raw * 83;
    const lakhCrore = inr / 1e12;
    return `₹${lakhCrore.toFixed(1)}L Cr`;
}

// ── Public fetcher: Market Indices ──

export async function fetchLiveIndices(
    mockIndices: MarketIndex[]
): Promise<MarketIndex[] | null> {
    try {
        const results = await Promise.all(
            mockIndices.map(async (idx) => {
                const yfTicker = INDEX_YF_MAP[idx.ticker];
                if (!yfTicker) return idx;

                const quote = await fetchYFQuote(yfTicker);
                if (!quote) return idx;

                return {
                    ...idx,
                    value: quote.price,
                    change: parseFloat(quote.change.toFixed(2)),
                    changePercent: parseFloat(quote.changePercent.toFixed(2)),
                };
            })
        );
        return results;
    } catch {
        return null;
    }
}

// ── Public fetcher: Sector Performance ──
// Only updates performance (%) and marketCap.
// aiVulnerability and automationRisk always kept from mock.

export async function fetchLiveSectorPerformance(
    mockSectors: SectorData[]
): Promise<SectorData[] | null> {
    try {
        const results = await Promise.all(
            mockSectors.map(async (sector) => {
                const yfTicker = SECTOR_YF_MAP[sector.ticker];
                if (!yfTicker) return sector;

                const quote = await fetchYFQuote(yfTicker);
                if (!quote) return sector;

                const formattedCap = formatMarketCap(quote.marketCap, sector.market);

                return {
                    ...sector,
                    performance: parseFloat(quote.changePercent.toFixed(2)),
                    ...(formattedCap ? { marketCap: formattedCap } : {}),
                };
            })
        );
        return results;
    } catch {
        return null;
    }
}

// ── Public fetcher: Earnings (Finnhub) ──

interface FinnhubEarning {
    actual: number | null;
    estimate: number | null;
    surprisePercent: number | null;
    period: string;
}

async function fetchFinnhubEarnings(
    ticker: string,
    apiKey: string
): Promise<FinnhubEarning[] | null> {
    try {
        // Finnhub uses plain tickers — strip Yahoo's .NS suffix
        const cleanTicker = ticker.replace(".NS", "");
        const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${cleanTicker}&limit=4&token=${apiKey}`;
        const res = await fetch(url, {
            signal: AbortSignal.timeout(3000),
            cache: "no-store",
        });
        if (!res.ok) return null;
        const json = await res.json();
        return Array.isArray(json) ? json : null;
    } catch {
        return null;
    }
}

export async function fetchLiveEarnings(
    mockEarnings: EarningsReport[]
): Promise<EarningsReport[] | null> {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) return null;

    try {
        const results = await Promise.all(
            mockEarnings.map(async (report) => {
                const data = await fetchFinnhubEarnings(report.ticker, apiKey);
                if (!data || data.length === 0) return report;

                const latest = data[0];
                if (latest.actual == null || latest.estimate == null) return report;

                const beat = latest.actual >= latest.estimate;
                const surprise = parseFloat((latest.surprisePercent ?? 0).toFixed(2));

                return {
                    ...report,
                    // Keep: company, ticker, sector, market, aiMentions (static intelligence)
                    eps: latest.actual,
                    epsEstimate: latest.estimate,
                    beat,
                    surprise,
                    date: latest.period,
                };
            })
        );
        return results;
    } catch {
        return null;
    }
}

// ── Public fetcher: News (Finnhub) ──

interface FinnhubNewsItem {
    id: number;
    headline: string;
    source: string;
    datetime: number;
}

export async function fetchLiveNews(): Promise<MarketNews[] | null> {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) return null;

    try {
        const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
        const res = await fetch(url, {
            signal: AbortSignal.timeout(3000),
            cache: "no-store",
        });
        if (!res.ok) return null;
        const json: FinnhubNewsItem[] = await res.json();
        if (!Array.isArray(json)) return null;

        return json.slice(0, 10).map((item) => ({
            id: String(item.id),
            headline: item.headline,
            source: item.source,
            sector: "General",
            sentiment: "NEUTRAL" as const,
            timestamp: new Date(item.datetime * 1000).toISOString(),
            impact: "MEDIUM" as const,
        }));
    } catch {
        return null;
    }
}

// ============================================
// MarketMind — Mock Financial Data Layer
// Dual-market: US + Indian (IN) data
// Swap with live APIs without changing frontend.
// ============================================

export interface SectorData {
    name: string;
    ticker: string;
    market: "US" | "IN";
    aiVulnerability: number;
    performance: number;
    marketCap: string;
    automationRisk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
}

export interface EarningsReport {
    company: string;
    ticker: string;
    sector: string;
    market: "US" | "IN";
    revenue: number;
    revenueEstimate: number;
    eps: number;
    epsEstimate: number;
    beat: boolean;
    surprise: number;
    aiMentions: number;
    priceChange: number;
    date: string;
}

export interface MarketIndex {
    name: string;
    ticker: string;
    market: "US" | "IN";
    value: number;
    change: number;
    changePercent: number;
}

export interface MarketNews {
    id: string;
    headline: string;
    source: string;
    sector: string;
    sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
    timestamp: string;
    impact: "HIGH" | "MEDIUM" | "LOW";
}

// ───── SECTORS ─────

export function getSectorData(): SectorData[] {
    return [
        // US Sectors
        {
            name: "Transportation & Logistics",
            ticker: "XTN",
            market: "US",
            aiVulnerability: 89,
            performance: -4.2,
            marketCap: "$1.2T",
            automationRisk: "CRITICAL",
        },
        {
            name: "Financial Services",
            ticker: "XLF",
            market: "US",
            aiVulnerability: 82,
            performance: -1.8,
            marketCap: "$4.8T",
            automationRisk: "CRITICAL",
        },
        {
            name: "Retail & E-Commerce",
            ticker: "XRT",
            market: "US",
            aiVulnerability: 76,
            performance: -3.1,
            marketCap: "$2.1T",
            automationRisk: "HIGH",
        },
        {
            name: "Healthcare Admin",
            ticker: "XLV",
            market: "US",
            aiVulnerability: 71,
            performance: 0.4,
            marketCap: "$3.5T",
            automationRisk: "HIGH",
        },
        {
            name: "Media & Entertainment",
            ticker: "XLC",
            market: "US",
            aiVulnerability: 68,
            performance: -2.5,
            marketCap: "$2.8T",
            automationRisk: "HIGH",
        },
        {
            name: "Manufacturing",
            ticker: "XLI",
            market: "US",
            aiVulnerability: 55,
            performance: 1.2,
            marketCap: "$3.2T",
            automationRisk: "MODERATE",
        },
        {
            name: "Technology",
            ticker: "XLK",
            market: "US",
            aiVulnerability: 35,
            performance: 6.8,
            marketCap: "$12.4T",
            automationRisk: "MODERATE",
        },
        {
            name: "Energy & Utilities",
            ticker: "XLE",
            market: "US",
            aiVulnerability: 28,
            performance: 2.1,
            marketCap: "$3.7T",
            automationRisk: "LOW",
        },
        {
            name: "Biotech & Pharma",
            ticker: "XBI",
            market: "US",
            aiVulnerability: 22,
            performance: 3.4,
            marketCap: "$1.9T",
            automationRisk: "LOW",
        },
        {
            name: "Defense & Aerospace",
            ticker: "XAR",
            market: "US",
            aiVulnerability: 15,
            performance: 4.7,
            marketCap: "$2.3T",
            automationRisk: "LOW",
        },
        // Indian Sectors
        {
            name: "IT Services",
            ticker: "NIFTYIT",
            market: "IN",
            aiVulnerability: 78,
            performance: -5.3,
            marketCap: "₹28.4L Cr",
            automationRisk: "HIGH",
        },
        {
            name: "Banking & Finance",
            ticker: "BANKNIFTY",
            market: "IN",
            aiVulnerability: 72,
            performance: -0.9,
            marketCap: "₹45.2L Cr",
            automationRisk: "HIGH",
        },
        {
            name: "Pharma",
            ticker: "NIFTYPHARMA",
            market: "IN",
            aiVulnerability: 25,
            performance: 4.1,
            marketCap: "₹12.8L Cr",
            automationRisk: "LOW",
        },
        {
            name: "Auto & Manufacturing",
            ticker: "NIFTYAUTO",
            market: "IN",
            aiVulnerability: 58,
            performance: 1.7,
            marketCap: "₹18.6L Cr",
            automationRisk: "MODERATE",
        },
        {
            name: "FMCG",
            ticker: "NIFTYFMCG",
            market: "IN",
            aiVulnerability: 32,
            performance: 0.8,
            marketCap: "₹15.1L Cr",
            automationRisk: "LOW",
        },
    ];
}

// ───── EARNINGS ─────

export function getEarningsReports(): EarningsReport[] {
    return [
        // US Earnings
        {
            company: "NVIDIA",
            ticker: "NVDA",
            sector: "Technology",
            market: "US",
            revenue: 35.1,
            revenueEstimate: 33.2,
            eps: 0.89,
            epsEstimate: 0.84,
            beat: true,
            surprise: 5.95,
            aiMentions: 147,
            priceChange: 8.2,
            date: "2026-02-26",
        },
        {
            company: "JPMorgan Chase",
            ticker: "JPM",
            sector: "Financial Services",
            market: "US",
            revenue: 44.2,
            revenueEstimate: 43.8,
            eps: 4.81,
            epsEstimate: 4.65,
            beat: true,
            surprise: 3.44,
            aiMentions: 42,
            priceChange: 2.1,
            date: "2026-02-24",
        },
        {
            company: "Tesla",
            ticker: "TSLA",
            sector: "Manufacturing",
            market: "US",
            revenue: 26.3,
            revenueEstimate: 27.1,
            eps: 0.71,
            epsEstimate: 0.78,
            beat: false,
            surprise: -8.97,
            aiMentions: 89,
            priceChange: -6.4,
            date: "2026-02-22",
        },
        {
            company: "Amazon",
            ticker: "AMZN",
            sector: "Retail & E-Commerce",
            market: "US",
            revenue: 178.3,
            revenueEstimate: 175.9,
            eps: 1.43,
            epsEstimate: 1.38,
            beat: true,
            surprise: 3.62,
            aiMentions: 73,
            priceChange: 3.8,
            date: "2026-02-20",
        },
        {
            company: "UnitedHealth",
            ticker: "UNH",
            sector: "Healthcare Admin",
            market: "US",
            revenue: 100.8,
            revenueEstimate: 99.2,
            eps: 7.12,
            epsEstimate: 6.95,
            beat: true,
            surprise: 2.45,
            aiMentions: 31,
            priceChange: 1.5,
            date: "2026-02-18",
        },
        {
            company: "Meta Platforms",
            ticker: "META",
            sector: "Media & Entertainment",
            market: "US",
            revenue: 46.7,
            revenueEstimate: 45.2,
            eps: 6.29,
            epsEstimate: 5.98,
            beat: true,
            surprise: 5.18,
            aiMentions: 112,
            priceChange: 5.2,
            date: "2026-02-16",
        },
        {
            company: "FedEx",
            ticker: "FDX",
            sector: "Transportation & Logistics",
            market: "US",
            revenue: 22.1,
            revenueEstimate: 23.4,
            eps: 4.55,
            epsEstimate: 4.92,
            beat: false,
            surprise: -7.52,
            aiMentions: 56,
            priceChange: -9.1,
            date: "2026-02-14",
        },
        {
            company: "Lockheed Martin",
            ticker: "LMT",
            sector: "Defense & Aerospace",
            market: "US",
            revenue: 18.9,
            revenueEstimate: 18.5,
            eps: 7.33,
            epsEstimate: 7.15,
            beat: true,
            surprise: 2.52,
            aiMentions: 18,
            priceChange: 1.8,
            date: "2026-02-12",
        },
        // Indian Earnings
        {
            company: "TCS",
            ticker: "TCS.NS",
            sector: "IT Services",
            market: "IN",
            revenue: 64.3, // ₹64,259 Cr → displayed as billions for consistency
            revenueEstimate: 63.8,
            eps: 12.19,
            epsEstimate: 11.85,
            beat: true,
            surprise: 2.87,
            aiMentions: 67,
            priceChange: -2.3,
            date: "2026-02-25",
        },
        {
            company: "Infosys",
            ticker: "INFY.NS",
            sector: "IT Services",
            market: "IN",
            revenue: 41.8,
            revenueEstimate: 41.2,
            eps: 16.43,
            epsEstimate: 15.90,
            beat: true,
            surprise: 3.33,
            aiMentions: 84,
            priceChange: 1.8,
            date: "2026-02-23",
        },
        {
            company: "Wipro",
            ticker: "WIPRO.NS",
            sector: "IT Services",
            market: "IN",
            revenue: 22.3,
            revenueEstimate: 22.8,
            eps: 6.02,
            epsEstimate: 6.35,
            beat: false,
            surprise: -5.20,
            aiMentions: 38,
            priceChange: -4.7,
            date: "2026-02-21",
        },
        {
            company: "HCL Technologies",
            ticker: "HCLTECH.NS",
            sector: "IT Services",
            market: "IN",
            revenue: 29.1,
            revenueEstimate: 28.6,
            eps: 18.72,
            epsEstimate: 18.10,
            beat: true,
            surprise: 3.43,
            aiMentions: 52,
            priceChange: 3.1,
            date: "2026-02-19",
        },
        {
            company: "HDFC Bank",
            ticker: "HDFCBANK.NS",
            sector: "Banking & Finance",
            market: "IN",
            revenue: 28.7,
            revenueEstimate: 28.2,
            eps: 21.35,
            epsEstimate: 20.80,
            beat: true,
            surprise: 2.64,
            aiMentions: 23,
            priceChange: 1.2,
            date: "2026-02-17",
        },
        {
            company: "Reliance Industries",
            ticker: "RELIANCE.NS",
            sector: "Auto & Manufacturing",
            market: "IN",
            revenue: 246.8,
            revenueEstimate: 241.5,
            eps: 38.42,
            epsEstimate: 37.10,
            beat: true,
            surprise: 3.56,
            aiMentions: 45,
            priceChange: 2.4,
            date: "2026-02-15",
        },
    ];
}

// ───── MARKET INDICES ─────

export function getMarketIndices(): MarketIndex[] {
    return [
        // US Indices
        { name: "S&P 500", ticker: "SPX", market: "US", value: 6142.38, change: 23.47, changePercent: 0.38 },
        { name: "NASDAQ", ticker: "IXIC", market: "US", value: 19847.12, change: -56.23, changePercent: -0.28 },
        { name: "DOW JONES", ticker: "DJI", market: "US", value: 44231.89, change: 112.56, changePercent: 0.26 },
        { name: "RUSSELL 2000", ticker: "RUT", market: "US", value: 2287.45, change: -18.34, changePercent: -0.80 },
        { name: "VIX", ticker: "VIX", market: "US", value: 18.42, change: 1.23, changePercent: 7.15 },
        { name: "10Y YIELD", ticker: "TNX", market: "US", value: 4.28, change: 0.03, changePercent: 0.71 },
        { name: "CRUDE OIL", ticker: "CL", market: "US", value: 72.84, change: -0.92, changePercent: -1.25 },
        { name: "GOLD", ticker: "GC", market: "US", value: 2956.70, change: 14.30, changePercent: 0.49 },
        { name: "BTC/USD", ticker: "BTC", market: "US", value: 84215.00, change: 1250.00, changePercent: 1.51 },
        // Indian Indices
        { name: "NIFTY 50", ticker: "NIFTY", market: "IN", value: 22478.50, change: -124.30, changePercent: -0.55 },
        { name: "SENSEX", ticker: "SENSEX", market: "IN", value: 74085.20, change: -389.70, changePercent: -0.52 },
        { name: "NIFTY IT", ticker: "NIFTYIT", market: "IN", value: 34562.80, change: -612.40, changePercent: -1.74 },
        { name: "BANK NIFTY", ticker: "BANKNIFTY", market: "IN", value: 47823.60, change: 156.20, changePercent: 0.33 },
        { name: "INR/USD", ticker: "USDINR", market: "IN", value: 83.42, change: 0.18, changePercent: 0.22 },
    ];
}

// ───── NEWS ─────

export function getMarketNews(): MarketNews[] {
    return [
        {
            id: "n1",
            headline: "NVIDIA reports record Q4 revenue driven by data center AI demand surge",
            source: "Reuters",
            sector: "Technology",
            sentiment: "BULLISH",
            timestamp: "2026-02-28T14:30:00Z",
            impact: "HIGH",
        },
        {
            id: "n2",
            headline: "Goldman Sachs warns 300K financial analyst jobs at risk from AI automation",
            source: "Bloomberg",
            sector: "Financial Services",
            sentiment: "BEARISH",
            timestamp: "2026-02-28T11:15:00Z",
            impact: "HIGH",
        },
        {
            id: "n3",
            headline: "Waymo expands autonomous trucking routes, FedEx partnership deepens",
            source: "WSJ",
            sector: "Transportation & Logistics",
            sentiment: "BEARISH",
            timestamp: "2026-02-27T16:45:00Z",
            impact: "HIGH",
        },
        {
            id: "n4",
            headline: "TCS warns of margin pressure as GenAI reduces billable headcount by 8%",
            source: "Economic Times",
            sector: "IT Services",
            sentiment: "BEARISH",
            timestamp: "2026-02-27T10:30:00Z",
            impact: "HIGH",
        },
        {
            id: "n5",
            headline: "Infosys launches AI-first delivery model; targets 30% productivity gain",
            source: "Mint",
            sector: "IT Services",
            sentiment: "BULLISH",
            timestamp: "2026-02-26T14:00:00Z",
            impact: "HIGH",
        },
        {
            id: "n6",
            headline: "FDA approves AI-assisted drug discovery platform, Moderna partners",
            source: "Reuters",
            sector: "Biotech & Pharma",
            sentiment: "BULLISH",
            timestamp: "2026-02-26T13:00:00Z",
            impact: "MEDIUM",
        },
        {
            id: "n7",
            headline: "OpenAI's Sora 2 disrupts advertising industry; WPP shares drop 12%",
            source: "Financial Times",
            sector: "Media & Entertainment",
            sentiment: "BEARISH",
            timestamp: "2026-02-26T08:30:00Z",
            impact: "HIGH",
        },
        {
            id: "n8",
            headline: "HDFC Bank deploys AI-powered credit underwriting, cuts processing time 60%",
            source: "Business Standard",
            sector: "Banking & Finance",
            sentiment: "BULLISH",
            timestamp: "2026-02-25T11:45:00Z",
            impact: "MEDIUM",
        },
        {
            id: "n9",
            headline: "Lockheed Martin secures $4.2B AI-enhanced defense contract with Pentagon",
            source: "Defense One",
            sector: "Defense & Aerospace",
            sentiment: "BULLISH",
            timestamp: "2026-02-25T15:10:00Z",
            impact: "MEDIUM",
        },
        {
            id: "n10",
            headline: "Wipro Q3 miss raises concerns about Indian IT sector's competitive positioning",
            source: "CNBC-TV18",
            sector: "IT Services",
            sentiment: "BEARISH",
            timestamp: "2026-02-24T09:15:00Z",
            impact: "MEDIUM",
        },
    ];
}

// ───── MARKET SUMMARY (for AI context injection) ─────

export function getMarketSummary(): string {
    const sectors = getSectorData();
    const earnings = getEarningsReports();
    const indices = getMarketIndices();
    const news = getMarketNews();

    return `
CURRENT MARKET DATA (as of March 1, 2026):

US INDICES:
${indices.filter((i) => i.market === "US").map((i) => `${i.name} (${i.ticker}): ${i.value.toLocaleString()} | ${i.change >= 0 ? "+" : ""}${i.change} (${i.changePercent >= 0 ? "+" : ""}${i.changePercent}%)`).join("\n")}

INDIAN INDICES:
${indices.filter((i) => i.market === "IN").map((i) => `${i.name} (${i.ticker}): ${i.value.toLocaleString()} | ${i.change >= 0 ? "+" : ""}${i.change} (${i.changePercent >= 0 ? "+" : ""}${i.changePercent}%)`).join("\n")}

SECTOR AI VULNERABILITY RANKINGS (US):
${sectors.filter((s) => s.market === "US").map((s, i) => `${i + 1}. ${s.name} (${s.ticker}) — Vulnerability: ${s.aiVulnerability}/100 [${s.automationRisk}] | Performance: ${s.performance >= 0 ? "+" : ""}${s.performance}%`).join("\n")}

SECTOR AI VULNERABILITY RANKINGS (INDIA):
${sectors.filter((s) => s.market === "IN").map((s, i) => `${i + 1}. ${s.name} (${s.ticker}) — Vulnerability: ${s.aiVulnerability}/100 [${s.automationRisk}] | Performance: ${s.performance >= 0 ? "+" : ""}${s.performance}%`).join("\n")}

RECENT EARNINGS (US):
${earnings.filter((e) => e.market === "US").map((e) => `${e.company} (${e.ticker}): Revenue $${e.revenue}B ${e.beat ? "BEAT" : "MISS"} (est. $${e.revenueEstimate}B) | EPS $${e.eps} (est. $${e.epsEstimate}) | AI Mentions: ${e.aiMentions} | Post: ${e.priceChange >= 0 ? "+" : ""}${e.priceChange}%`).join("\n")}

RECENT EARNINGS (INDIA):
${earnings.filter((e) => e.market === "IN").map((e) => `${e.company} (${e.ticker}): Revenue ₹${e.revenue}K Cr ${e.beat ? "BEAT" : "MISS"} (est. ₹${e.revenueEstimate}K Cr) | EPS ₹${e.eps} (est. ₹${e.epsEstimate}) | AI Mentions: ${e.aiMentions} | Post: ${e.priceChange >= 0 ? "+" : ""}${e.priceChange}%`).join("\n")}

LATEST NEWS:
${news.map((n) => `[${n.sentiment}] ${n.headline} — ${n.source} (${n.sector})`).join("\n")}
  `.trim();
}

import { NextRequest, NextResponse } from "next/server";
import { getMarketNews } from "@/lib/market-data";

const PAGE_SIZE = 20;

interface FinnhubArticle {
    id: number;
    headline: string;
    summary: string;
    source: string;
    datetime: number;
    url: string;
    image: string;
    category: string;
    related: string;
}

const BULLISH_TERMS = [
    "surges", "record", "beat", "profit", "growth", "gains", "rally", "bullish",
    "upgrade", "raises", "expands", "launches", "partners", "wins", "approves",
];
const BEARISH_TERMS = [
    "falls", "drops", "warns", "risk", "layoffs", "cuts", "loss", "bearish",
    "downgrades", "misses", "declines", "plunges", "collapse", "concern", "disrupts",
];

function classifySentiment(headline: string): "BULLISH" | "BEARISH" | "NEUTRAL" {
    const lower = headline.toLowerCase();
    const bullish = BULLISH_TERMS.filter((t) => lower.includes(t)).length;
    const bearish = BEARISH_TERMS.filter((t) => lower.includes(t)).length;
    if (bullish > bearish) return "BULLISH";
    if (bearish > bullish) return "BEARISH";
    return "NEUTRAL";
}

function classifyImpact(headline: string): "HIGH" | "MEDIUM" | "LOW" {
    const lower = headline.toLowerCase();
    const highTerms = ["record", "billion", "trillion", "collapse", "crisis", "surge", "plunge", "ban", "deal"];
    if (highTerms.some((t) => lower.includes(t))) return "HIGH";
    return "MEDIUM";
}

function inferSector(related: string, headline: string): string {
    const h = headline.toLowerCase();
    if (/nvidia|amd|intel|tsmc|semiconductor/.test(h)) return "Technology";
    if (/bank|fed|rate|goldman|jpmorgan|finance/.test(h)) return "Financial Services";
    if (/oil|energy|opec|exxon|chevron/.test(h)) return "Energy";
    if (/pharma|fda|drug|biotech|health/.test(h)) return "Biotech & Pharma";
    if (/tcs|infosys|wipro|hcl|tech mahindra/.test(h)) return "IT Services";
    if (/retail|amazon|walmart|consumer/.test(h)) return "Retail";
    if (/auto|ev|tesla|ford|toyota/.test(h)) return "Automotive";
    if (related) return related.split(",")[0] || "General";
    return "General";
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const minId = searchParams.get("minId");
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
        // Fallback: paginate static data
        const all = getMarketNews();
        const offset = parseInt(searchParams.get("offset") ?? "0");
        const page = all.slice(offset, offset + PAGE_SIZE);
        return NextResponse.json({
            articles: page,
            nextCursor: offset + page.length < all.length ? String(offset + page.length) : null,
            live: false,
        });
    }

    try {
        let url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
        if (minId) url += `&minId=${minId}`;

        const res = await fetch(url, {
            signal: AbortSignal.timeout(5000),
            cache: "no-store",
        });

        if (!res.ok) throw new Error(`Finnhub ${res.status}`);

        const raw: FinnhubArticle[] = await res.json();
        if (!Array.isArray(raw) || raw.length === 0) {
            return NextResponse.json({ articles: [], nextCursor: null, live: true });
        }

        const articles = raw.slice(0, PAGE_SIZE).map((item) => ({
            id: String(item.id),
            headline: item.headline,
            summary: item.summary ?? "",
            source: item.source,
            url: item.url ?? "",
            image: item.image ?? "",
            sector: inferSector(item.related ?? "", item.headline),
            sentiment: classifySentiment(item.headline),
            timestamp: new Date(item.datetime * 1000).toISOString(),
            impact: classifyImpact(item.headline),
        }));

        const minArticleId = raw.length >= PAGE_SIZE ? String(Math.min(...raw.map((a) => a.id))) : null;

        return NextResponse.json({
            articles,
            nextCursor: minArticleId,
            live: true,
        });
    } catch {
        // Fallback to static on error
        const all = getMarketNews();
        return NextResponse.json({
            articles: all.slice(0, PAGE_SIZE),
            nextCursor: null,
            live: false,
        });
    }
}

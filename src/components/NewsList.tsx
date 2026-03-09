"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./generative/generative.module.css";

interface NewsArticle {
    id: string;
    headline: string;
    summary: string;
    source: string;
    url: string;
    image: string;
    sector: string;
    sentiment: string;
    timestamp: string;
    impact: string;
}

interface NewsResponse {
    articles: NewsArticle[];
    nextCursor: string | null;
    live: boolean;
}

const REFRESH_INTERVAL_MS = 60_000;

function getSentimentClass(sentiment: string): string {
    switch (sentiment) {
        case "BULLISH": return styles.sentimentBullish;
        case "BEARISH": return styles.sentimentBearish;
        default: return styles.sentimentNeutral;
    }
}

function getImpactClass(impact: string): string {
    switch (impact) {
        case "HIGH": return styles.impactHigh;
        case "MEDIUM": return styles.impactMedium;
        default: return styles.impactLow;
    }
}

function timeAgo(timestamp: string): string {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsList() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [newCount, setNewCount] = useState(0);

    const sentinelRef = useRef<HTMLDivElement>(null);
    const seenIds = useRef<Set<string>>(new Set());
    const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchPage = useCallback(async (minId?: string): Promise<NewsResponse | null> => {
        try {
            const params = new URLSearchParams();
            if (minId) params.set("minId", minId);
            const res = await fetch(`/api/news?${params}`);
            if (!res.ok) return null;
            return res.json();
        } catch {
            return null;
        }
    }, []);

    // Initial load
    useEffect(() => {
        (async () => {
            const data = await fetchPage();
            if (!data) { setLoading(false); return; }
            data.articles.forEach((a) => seenIds.current.add(a.id));
            setArticles(data.articles);
            setCursor(data.nextCursor);
            setIsLive(data.live);
            setHasMore(!!data.nextCursor);
            setLoading(false);
        })();
    }, [fetchPage]);

    // Auto-refresh: fetch latest (no minId) and prepend new items
    useEffect(() => {
        refreshTimer.current = setInterval(async () => {
            const data = await fetchPage();
            if (!data) return;
            const fresh = data.articles.filter((a) => !seenIds.current.has(a.id));
            if (fresh.length === 0) return;
            fresh.forEach((a) => seenIds.current.add(a.id));
            setArticles((prev) => [...fresh, ...prev]);
            setNewCount((n) => n + fresh.length);
        }, REFRESH_INTERVAL_MS);
        return () => { if (refreshTimer.current) clearInterval(refreshTimer.current); };
    }, [fetchPage]);

    // Infinite scroll via IntersectionObserver
    useEffect(() => {
        if (!hasMore || loadingMore) return;
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting || !cursor) return;
                setLoadingMore(true);
                const data = await fetchPage(cursor);
                if (data) {
                    const fresh = data.articles.filter((a) => !seenIds.current.has(a.id));
                    fresh.forEach((a) => seenIds.current.add(a.id));
                    setArticles((prev) => [...prev, ...fresh]);
                    setCursor(data.nextCursor);
                    setHasMore(!!data.nextCursor && fresh.length > 0);
                } else {
                    setHasMore(false);
                }
                setLoadingMore(false);
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [cursor, hasMore, loadingMore, fetchPage]);

    return (
        <div className="panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="panel-header">
                <div className="panel-title">
                    <span className="live-dot" />
                    Market News Feed
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                    {newCount > 0 && (
                        <button
                            onClick={() => setNewCount(0)}
                            style={{
                                background: "var(--green-bg)",
                                color: "var(--green)",
                                border: "1px solid rgba(0,255,136,0.3)",
                                borderRadius: "999px",
                                padding: "2px 10px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "var(--text-xs)",
                                cursor: "pointer",
                            }}
                        >
                            +{newCount} new
                        </button>
                    )}
                    <div className={`badge ${isLive ? "badge-green" : ""}`} style={!isLive ? { background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" } : {}}>
                        {isLive ? "LIVE" : "CACHED"}
                    </div>
                    {articles.length > 0 && (
                        <div className="badge badge-green">{articles.length} ARTICLES</div>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-2) var(--space-3)" }}>
                {loading ? (
                    <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", padding: "var(--space-4)" }}>
                        Fetching live news...
                    </div>
                ) : articles.length === 0 ? (
                    <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", padding: "var(--space-4)" }}>
                        No news available.
                    </div>
                ) : (
                    <>
                        {articles.map((n) => (
                            <div key={n.id} className={styles.newsItem}>
                                <span className={`${styles.newsSentiment} ${getSentimentClass(n.sentiment)}`}>
                                    {n.sentiment === "BULLISH" ? "▲" : n.sentiment === "BEARISH" ? "▼" : "●"} {n.sentiment}
                                </span>
                                <div className={styles.newsContent}>
                                    {n.url ? (
                                        <a
                                            href={n.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.newsHeadline}
                                            style={{ color: "inherit", textDecoration: "none" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                                        >
                                            {n.headline}
                                        </a>
                                    ) : (
                                        <div className={styles.newsHeadline}>{n.headline}</div>
                                    )}
                                    {n.summary && (
                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "2px", lineHeight: 1.5, fontFamily: "var(--font-mono)" }}>
                                            {n.summary.length > 180 ? n.summary.slice(0, 180) + "…" : n.summary}
                                        </div>
                                    )}
                                    <div className={styles.newsMeta}>
                                        <span>{n.source}</span>
                                        <span>•</span>
                                        <span>{n.sector}</span>
                                        <span>•</span>
                                        <span className={getImpactClass(n.impact)}>{n.impact} IMPACT</span>
                                        <span>•</span>
                                        <span>{timeAgo(n.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} style={{ height: 1 }} />

                        {loadingMore && (
                            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", textAlign: "center", padding: "var(--space-3)" }}>
                                Loading more...
                            </div>
                        )}
                        {!hasMore && articles.length > 0 && (
                            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", textAlign: "center", padding: "var(--space-3)" }}>
                                — end of feed —
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

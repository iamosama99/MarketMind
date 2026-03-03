import type { NewsOutput } from "@/lib/schemas";
import styles from "./generative.module.css";

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

export default function NewsFeed({ data }: { data: NewsOutput }) {
    if (!data.news || data.news.length === 0) {
        return (
            <div className={styles.genContainer}>
                <div className={styles.genHeader}>
                    <div className={styles.genTitle}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--amber)", display: "inline-block" }} />
                        Market News
                    </div>
                </div>
                <div className={styles.genBody}>
                    <span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                        No news found for the given criteria.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.genContainer}>
            <div className={styles.genHeader}>
                <div className={styles.genTitle}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--amber)", display: "inline-block" }} />
                    Market News
                </div>
                <div className={styles.genBadge}>{data.news.length} ARTICLES</div>
            </div>
            <div className={styles.genBody}>
                {data.news.map((n) => (
                    <div key={n.id} className={styles.newsItem}>
                        <span className={`${styles.newsSentiment} ${getSentimentClass(n.sentiment)}`}>
                            {n.sentiment === "BULLISH" ? "▲" : n.sentiment === "BEARISH" ? "▼" : "●"} {n.sentiment}
                        </span>
                        <div className={styles.newsContent}>
                            <div className={styles.newsHeadline}>{n.headline}</div>
                            <div className={styles.newsMeta}>
                                <span>{n.source}</span>
                                <span>•</span>
                                <span>{n.sector}</span>
                                <span>•</span>
                                <span className={getImpactClass(n.impact)}>
                                    {n.impact} IMPACT
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

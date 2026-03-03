import type { MarketOverviewOutput } from "@/lib/schemas";
import styles from "./generative.module.css";

export default function MarketOverview({ data }: { data: MarketOverviewOutput }) {
    if (!data.indices || data.indices.length === 0) {
        return (
            <div className={styles.genContainer}>
                <div className={styles.genHeader}>
                    <div className={styles.genTitle}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--green)", display: "inline-block" }} />
                        Market Overview
                    </div>
                </div>
                <div className={styles.genBody}>
                    <span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                        No market indices found.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.genContainer}>
            <div className={styles.genHeader}>
                <div className={styles.genTitle}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--green)", display: "inline-block" }} />
                    Market Overview
                </div>
                <div className={styles.genBadge}>{data.indices.length} INDICES</div>
            </div>
            <div className={styles.genBody}>
                <div className={styles.indexGrid}>
                    {data.indices.map((idx) => {
                        const isPositive = idx.change >= 0;
                        return (
                            <div key={idx.ticker} className={styles.indexCard}>
                                <div className={styles.indexName}>
                                    {idx.market === "IN" ? "🇮🇳 " : ""}{idx.name}
                                </div>
                                <div className={styles.indexValue}>
                                    {idx.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </div>
                                <div className={styles.indexChange} style={{ color: isPositive ? "var(--green)" : "var(--red)" }}>
                                    {isPositive ? "▲" : "▼"} {Math.abs(idx.change).toFixed(2)} ({isPositive ? "+" : ""}{idx.changePercent.toFixed(2)}%)
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

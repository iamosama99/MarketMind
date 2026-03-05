import type { ResearchSourcesOutput } from "@/lib/schemas";
import styles from "./generative.module.css";

function getRelevanceClass(score: number): string {
    if (score >= 0.8) return styles.relevanceHigh;
    if (score >= 0.5) return styles.relevanceMedium;
    return styles.relevanceLow;
}

function getTypeIcon(type: string): string {
    switch (type) {
        case "report": return "📄";
        case "analysis": return "📊";
        case "whitepaper": return "📋";
        case "note": return "📝";
        default: return "📑";
    }
}

export default function ResearchSources({ data }: { data: ResearchSourcesOutput }) {
    if (!data.sources || data.sources.length === 0) {
        return (
            <div className={styles.genContainer}>
                <div className={styles.genHeader}>
                    <div className={styles.genTitle}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--purple)", display: "inline-block" }} />
                        Research Sources
                    </div>
                </div>
                <div className={styles.genBody}>
                    <span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                        No research sources found for this query.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.genContainer}>
            <div className={styles.genHeader}>
                <div className={styles.genTitle}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--purple)", display: "inline-block" }} />
                    Research Sources
                </div>
                <div className={styles.researchBadge}>{data.sources.length} SOURCES</div>
            </div>
            <div className={styles.genBody}>
                {data.sources.map((source, i) => (
                    <div key={i} className={styles.researchItem}>
                        <div className={styles.researchItemHeader}>
                            <span className={styles.researchType}>
                                {getTypeIcon(source.documentType)} {source.documentType.toUpperCase()}
                            </span>
                            <span className={`${styles.relevanceBadge} ${getRelevanceClass(source.score)}`}>
                                {(source.score * 100).toFixed(0)}% MATCH
                            </span>
                        </div>
                        <div className={styles.researchTitle}>{source.title}</div>
                        <div className={styles.researchSnippet}>
                            {source.content.slice(0, 300)}
                            {source.content.length > 300 ? "…" : ""}
                        </div>
                        <div className={styles.researchMeta}>
                            <span>{source.source}</span>
                            <span>•</span>
                            <span>{source.sector}</span>
                            {source.market && (
                                <>
                                    <span>•</span>
                                    <span className={styles.researchMarketTag}>{source.market}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

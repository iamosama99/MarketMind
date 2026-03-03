import type { SectorAnalysisOutput } from "@/lib/schemas";
import styles from "./generative.module.css";

function getBarColor(vulnerability: number): string {
    if (vulnerability >= 80) return "#ff3b5c";
    if (vulnerability >= 60) return "#ff6b35";
    if (vulnerability >= 40) return "#ffb84d";
    if (vulnerability >= 25) return "#4d9fff";
    return "#00ff88";
}

function getRiskClass(risk: string): string {
    switch (risk) {
        case "CRITICAL": return styles.riskCritical;
        case "HIGH": return styles.riskHigh;
        case "MODERATE": return styles.riskModerate;
        default: return styles.riskLow;
    }
}

export default function SectorComparison({ data }: { data: SectorAnalysisOutput }) {
    if (!data.sectors || data.sectors.length === 0) {
        return (
            <div className={styles.genContainer}>
                <div className={styles.genHeader}>
                    <div className={styles.genTitle}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--red)", display: "inline-block" }} />
                        Sector Analysis
                    </div>
                </div>
                <div className={styles.genBody}>
                    <span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                        No sector data found for the given criteria.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.genContainer}>
            <div className={styles.genHeader}>
                <div className={styles.genTitle}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--red)", display: "inline-block" }} />
                    AI Vulnerability — Sector Analysis
                </div>
                <div className={styles.genBadge}>{data.sectors.length} SECTORS</div>
            </div>
            <div className={styles.genBody}>
                <div className={styles.sectorGrid}>
                    {data.sectors.map((s) => {
                        const barColor = getBarColor(s.aiVulnerability);
                        return (
                            <div key={s.ticker} className={styles.sectorCard}>
                                <div className={styles.sectorCardHeader}>
                                    <span className={styles.sectorName}>
                                        {s.market === "IN" ? "🇮🇳 " : ""}{s.name}
                                    </span>
                                    <span className={styles.sectorTicker}>{s.ticker}</span>
                                </div>
                                <div className={styles.sectorBarWrap}>
                                    <div
                                        className={styles.sectorBar}
                                        style={{ width: `${s.aiVulnerability}%`, background: barColor }}
                                    />
                                </div>
                                <div className={styles.sectorMeta}>
                                    <span className={styles.sectorScore} style={{ color: barColor }}>
                                        {s.aiVulnerability}/100
                                    </span>
                                    <span className={`${styles.riskBadge} ${getRiskClass(s.automationRisk)}`}>
                                        {s.automationRisk}
                                    </span>
                                </div>
                                <div className={styles.sectorMeta} style={{ marginTop: 4 }}>
                                    <span style={{ color: "var(--text-tertiary)" }}>{s.marketCap}</span>
                                    <span className={s.performance >= 0 ? "value-positive" : "value-negative"}>
                                        {s.performance >= 0 ? "+" : ""}{s.performance}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

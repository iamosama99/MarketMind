import type { EarningsReportOutput } from "@/lib/schemas";
import styles from "./generative.module.css";

export default function EarningsTable({ data }: { data: EarningsReportOutput }) {
    if (!data.earnings || data.earnings.length === 0) {
        return (
            <div className={styles.genContainer}>
                <div className={styles.genHeader}>
                    <div className={styles.genTitle}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--blue)", display: "inline-block" }} />
                        Earnings Report
                    </div>
                </div>
                <div className={styles.genBody}>
                    <span style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                        No earnings data found for the given criteria.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.genContainer}>
            <div className={styles.genHeader}>
                <div className={styles.genTitle}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--blue)", display: "inline-block" }} />
                    Earnings Report
                </div>
                <div className={styles.genBadge}>{data.earnings.length} RESULTS</div>
            </div>
            <div className={styles.genBody} style={{ padding: 0, overflow: "auto" }}>
                <table className={styles.earningsTable}>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Revenue</th>
                            <th>EPS</th>
                            <th>AI Refs</th>
                            <th>Result</th>
                            <th>Post</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.earnings.map((e) => {
                            const currSymbol = e.market === "IN" ? "₹" : "$";
                            const revUnit = e.market === "IN" ? "K Cr" : "B";
                            return (
                                <tr key={e.ticker}>
                                    <td>
                                        <span className={styles.earningsTicker}>
                                            {e.market === "IN" ? "🇮🇳 " : ""}{e.ticker}
                                        </span>
                                        <span className={styles.earningsCompany}>{e.company}</span>
                                    </td>
                                    <td>
                                        {currSymbol}{e.revenue}{revUnit}
                                        <span className={styles.earningsCompany}>
                                            est. {currSymbol}{e.revenueEstimate}{revUnit}
                                        </span>
                                    </td>
                                    <td>
                                        {currSymbol}{e.eps}
                                        <span className={styles.earningsCompany}>
                                            est. {currSymbol}{e.epsEstimate}
                                        </span>
                                    </td>
                                    <td style={{
                                        color: e.aiMentions > 100 ? "var(--amber)" :
                                            e.aiMentions > 50 ? "var(--blue)" : "var(--text-secondary)",
                                    }}>
                                        {e.aiMentions}×
                                    </td>
                                    <td>
                                        <span className={`badge ${e.beat ? "badge-green" : "badge-red"}`}>
                                            {e.beat ? "BEAT" : "MISS"} {e.surprise >= 0 ? "+" : ""}{e.surprise.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td>
                                        <span className={e.priceChange >= 0 ? "value-positive" : "value-negative"}>
                                            {e.priceChange >= 0 ? "+" : ""}{e.priceChange}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

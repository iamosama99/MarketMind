"use client";

import { useQuery } from "urql";
import { GET_EARNINGS } from "@/lib/queries";
import styles from "./EarningsPanel.module.css";

interface EarningsItem {
    company: string;
    ticker: string;
    sector: string;
    market: string;
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

export default function EarningsPanel() {
    const [{ data, fetching }] = useQuery({ query: GET_EARNINGS });

    if (fetching || !data) {
        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--blue)", display: "inline-block" }} />
                        Earnings Intelligence
                    </div>
                </div>
                <div className={styles.tableWrap}>
                    <div className={styles.skeleton}>Loading earnings data...</div>
                </div>
            </div>
        );
    }

    const earnings: EarningsItem[] = data.earnings;

    return (
        <div className="panel">
            <div className="panel-header">
                <div className="panel-title">
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--blue)", display: "inline-block" }} />
                    Earnings Intelligence
                </div>
                <div className="badge badge-blue">{earnings.length} REPORTS</div>
            </div>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
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
                        {earnings.map((e) => (
                            <tr key={e.ticker} className={styles.row}>
                                <td>
                                    <div className={styles.company}>
                                        <span className={styles.ticker}>
                                            {e.market === "IN" ? "🇮🇳 " : ""}{e.ticker}
                                        </span>
                                        <span className={styles.name}>{e.company}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.metric}>
                                        <span>
                                            {e.market === "IN" ? "₹" : "$"}{e.revenue}
                                            {e.market === "IN" ? "K Cr" : "B"}
                                        </span>
                                        <span className={styles.estimate}>
                                            est. {e.market === "IN" ? "₹" : "$"}{e.revenueEstimate}
                                            {e.market === "IN" ? "K Cr" : "B"}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.metric}>
                                        <span>
                                            {e.market === "IN" ? "₹" : "$"}{e.eps}
                                        </span>
                                        <span className={styles.estimate}>
                                            est. {e.market === "IN" ? "₹" : "$"}{e.epsEstimate}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={styles.aiCount}
                                        style={{
                                            color:
                                                e.aiMentions > 100
                                                    ? "var(--amber)"
                                                    : e.aiMentions > 50
                                                        ? "var(--blue)"
                                                        : "var(--text-secondary)",
                                        }}
                                    >
                                        {e.aiMentions}×
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={`badge ${e.beat ? "badge-green" : "badge-red"}`}
                                    >
                                        {e.beat ? "BEAT" : "MISS"}
                                        <span style={{ marginLeft: 4 }}>
                                            {e.surprise >= 0 ? "+" : ""}
                                            {e.surprise.toFixed(1)}%
                                        </span>
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={
                                            e.priceChange >= 0 ? "value-positive" : "value-negative"
                                        }
                                    >
                                        {e.priceChange >= 0 ? "+" : ""}
                                        {e.priceChange}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

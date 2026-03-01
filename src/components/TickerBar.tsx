"use client";

import { useQuery } from "urql";
import { GET_INDICES } from "@/lib/queries";
import styles from "./TickerBar.module.css";

interface IndexData {
    name: string;
    ticker: string;
    market: string;
    value: number;
    change: number;
    changePercent: number;
}

export default function TickerBar() {
    const [{ data, fetching }] = useQuery({ query: GET_INDICES });

    if (fetching || !data) {
        return (
            <div className={styles.ticker}>
                <div className={styles.loading}>Loading market data...</div>
            </div>
        );
    }

    const indices: IndexData[] = data.indices;
    const tickerItems = [...indices, ...indices];

    return (
        <div className={styles.ticker}>
            <div className={styles.track}>
                {tickerItems.map((idx, i) => (
                    <div className={styles.item} key={`${idx.ticker}-${i}`}>
                        <span className={styles.name}>
                            {idx.market === "IN" ? "🇮🇳" : ""} {idx.ticker}
                        </span>
                        <span className={styles.value}>
                            {idx.value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                        <span
                            className={`${styles.change} ${idx.changePercent >= 0 ? styles.positive : styles.negative
                                }`}
                        >
                            {idx.changePercent >= 0 ? "▲" : "▼"}{" "}
                            {Math.abs(idx.changePercent).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

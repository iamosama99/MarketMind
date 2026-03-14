"use client";

import { useQuery } from "urql";
import { useEffect, useCallback } from "react";
import { GET_INDICES } from "@/lib/queries";
import styles from "./TickerBar.module.css";

const POLL_INTERVAL_MS = 30_000; // 30 seconds, matches server TTL

interface IndexData {
    name: string;
    ticker: string;
    market: string;
    value: number;
    change: number;
    changePercent: number;
}

interface TickerBarProps {
    market?: "US" | "IN";
}

export default function TickerBar({ market }: TickerBarProps) {
    const [{ data, fetching }, reexecute] = useQuery({
        query: GET_INDICES,
        variables: market ? { market } : {},
    });

    const refresh = useCallback(() => {
        reexecute({ requestPolicy: "network-only" });
    }, [reexecute]);

    useEffect(() => {
        const id = setInterval(refresh, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [refresh]);

    if (fetching && !data) {
        return (
            <div className={styles.ticker}>
                <div className={styles.loading}>Loading market data...</div>
            </div>
        );
    }

    if (!data) return null;

    const indices: IndexData[] = data.indices;
    const tickerItems = [...indices, ...indices];

    return (
        <div className={styles.ticker}>
            <div className={styles.track}>
                {tickerItems.map((idx, i) => (
                    <div className={styles.item} key={`${idx.ticker}-${i}`}>
                        <span className={styles.name}>
                            {idx.ticker}
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

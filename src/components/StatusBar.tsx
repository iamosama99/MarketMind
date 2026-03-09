"use client";

import { useEffect, useState } from "react";
import { useApiKeyContext } from "@/lib/api-key-context";
import styles from "./StatusBar.module.css";

interface DataStatus {
    indices: "live" | "mock";
    sectors: "live" | "mock";
    earnings: "live" | "mock";
    news: "live" | "mock";
}

export default function StatusBar() {
    const { hasApiKey } = useApiKeyContext();
    const [dataStatus, setDataStatus] = useState<DataStatus | null>(null);

    useEffect(() => {
        const fetchStatus = () =>
            fetch("/api/data-status")
                .then((r) => r.json())
                .then(setDataStatus)
                .catch(() => null);

        fetchStatus();
        const interval = setInterval(fetchStatus, 30_000);
        return () => clearInterval(interval);
    }, []);

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const isLive = dataStatus && (
        dataStatus.indices === "live" || dataStatus.sectors === "live"
    );
    const dataLabel = isLive ? "LIVE" : "MOCK v1.0";
    const dataColor = isLive ? "var(--green)" : undefined;

    return (
        <div className={styles.bar}>
            <div className={styles.section}>
                <span className={styles.statusDot} />
                <span className={styles.label}>CONNECTED</span>
            </div>
            <div className={styles.section}>
                <span className={styles.key}>MODEL</span>
                <span className={styles.value}>{process.env.NEXT_PUBLIC_LLM_LABEL || "OLLAMA"}</span>
            </div>
            <div className={styles.section}>
                <span className={styles.key}>PIPELINE</span>
                <span className={styles.value} style={{ color: "var(--green)" }}>MULTI-AGENT</span>
            </div>
            <div className={styles.section}>
                <span className={styles.key}>API</span>
                <span className={styles.value} style={{ color: hasApiKey ? "var(--green)" : "var(--red)" }}>
                    {hasApiKey ? "BYOK" : "NO KEY"}
                </span>
            </div>
            <div className={styles.section}>
                <span className={styles.key}>DATA</span>
                <span className={styles.value} style={{ color: dataColor }}>{dataLabel}</span>
            </div>
            <div className={styles.section}>
                <span className={styles.key}>REFRESH</span>
                <span className={styles.value} suppressHydrationWarning>{timeStr}</span>
            </div>
            <div className={styles.right}>
                <span className={styles.brand}>MARKETMIND</span>
                <span className={styles.date} suppressHydrationWarning>{dateStr}</span>
            </div>
        </div>
    );
}

"use client";

import styles from "./StatusBar.module.css";

export default function StatusBar() {
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
                <span className={styles.key}>DATA</span>
                <span className={styles.value}>MOCK v1.0</span>
            </div>
            <div className={styles.section}>
                <span className={styles.key}>REFRESH</span>
                <span className={styles.value}>{timeStr}</span>
            </div>
            <div className={styles.right}>
                <span className={styles.brand}>MARKETMIND</span>
                <span className={styles.date}>{dateStr}</span>
            </div>
        </div>
    );
}

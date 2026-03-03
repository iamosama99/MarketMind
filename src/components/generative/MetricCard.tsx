import type { MetricOutput } from "@/lib/schemas";
import styles from "./generative.module.css";

export default function MetricCard({ data }: { data: MetricOutput }) {
    const isPositive = data.change >= 0;

    return (
        <div className={styles.metricCard}>
            <div className={`${styles.metricIcon} ${isPositive ? styles.metricIconPositive : styles.metricIconNegative}`}>
                {isPositive ? "▲" : "▼"}
            </div>
            <div className={styles.metricContent}>
                <div className={styles.metricLabel}>{data.label}</div>
                <div className={styles.metricValue}>{data.value}</div>
                <div className={styles.metricDescription}>{data.description}</div>
            </div>
            <div className={`${styles.metricChange} ${isPositive ? styles.metricChangePositive : styles.metricChangeNegative}`}>
                {isPositive ? "+" : ""}{data.change.toFixed(2)}%
            </div>
        </div>
    );
}

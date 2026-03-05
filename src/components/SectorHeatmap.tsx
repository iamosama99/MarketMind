"use client";

import { useQuery } from "urql";
import { useRef, useState, useEffect } from "react";
import { GET_SECTORS } from "@/lib/queries";
import { Treemap, Tooltip } from "recharts";
import styles from "./SectorHeatmap.module.css";

interface SectorItem {
    name: string;
    ticker: string;
    market: string;
    aiVulnerability: number;
    performance: number;
    marketCap: string;
    automationRisk: string;
}

interface TreemapPayload {
    name: string;
    value: number;
    vulnerability: number;
    performance: number;
    risk: string;
    marketCap: string;
    ticker: string;
    market: string;
}

function getColor(vulnerability: number): string {
    if (vulnerability >= 80) return "#ff3b5c";
    if (vulnerability >= 60) return "#ff6b35";
    if (vulnerability >= 40) return "#ffb84d";
    if (vulnerability >= 25) return "#4d9fff";
    return "#00ff88";
}

function CustomContent(props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
    vulnerability?: number;
    ticker?: string;
    market?: string;
}) {
    const { x = 0, y = 0, width = 0, height = 0, vulnerability = 0, ticker, market } = props;

    if (width < 50 || height < 40) return null;
    const color = getColor(vulnerability);

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={4}
                ry={4}
                fill={color}
                fillOpacity={0.15}
                stroke={color}
                strokeWidth={1}
                strokeOpacity={0.4}
            />
            {width > 80 && (
                <>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        fill={color}
                        fontSize={11}
                        fontFamily="var(--font-mono)"
                        fontWeight={600}
                    >
                        {ticker}
                    </text>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 8}
                        textAnchor="middle"
                        fill="var(--text-secondary)"
                        fontSize={9}
                        fontFamily="var(--font-mono)"
                    >
                        {vulnerability}/100
                    </text>
                </>
            )}
            {width <= 80 && width > 50 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 3}
                    textAnchor="middle"
                    fill={color}
                    fontSize={10}
                    fontFamily="var(--font-mono)"
                    fontWeight={600}
                >
                    {ticker}
                </text>
            )}
        </g>
    );
}

function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ payload: TreemapPayload }>;
}) {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;
    return (
        <div className={styles.tooltip}>
            <div className={styles.tooltipHeader}>
                <span className={styles.tooltipName}>
                    {data.name}
                </span>
                <span className={styles.tooltipTicker}>{data.ticker}</span>
            </div>
            <div className={styles.tooltipRow}>
                <span>AI Vulnerability</span>
                <span style={{ color: getColor(data.vulnerability) }}>
                    {data.vulnerability}/100
                </span>
            </div>
            <div className={styles.tooltipRow}>
                <span>Risk Level</span>
                <span
                    style={{
                        color:
                            data.risk === "CRITICAL"
                                ? "#ff3b5c"
                                : data.risk === "HIGH"
                                    ? "#ff6b35"
                                    : data.risk === "MODERATE"
                                        ? "#ffb84d"
                                        : "#00ff88",
                    }}
                >
                    {data.risk}
                </span>
            </div>
            <div className={styles.tooltipRow}>
                <span>Performance</span>
                <span
                    className={
                        data.performance >= 0 ? "value-positive" : "value-negative"
                    }
                >
                    {data.performance >= 0 ? "+" : ""}
                    {data.performance}%
                </span>
            </div>
            <div className={styles.tooltipRow}>
                <span>Market Cap</span>
                <span>{data.marketCap}</span>
            </div>
        </div>
    );
}

export default function SectorHeatmap() {
    const [{ data: queryData, fetching }] = useQuery({ query: GET_SECTORS });
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setDims({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    if (fetching || !queryData) {
        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--red)", display: "inline-block" }} />
                        AI Vulnerability Heatmap
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.skeleton}>Loading sector data...</div>
                </div>
            </div>
        );
    }

    const sectors: SectorItem[] = queryData.sectors;
    const treeData = sectors.map((s) => ({
        name: s.name,
        value: s.aiVulnerability * 10 + 100,
        vulnerability: s.aiVulnerability,
        performance: s.performance,
        risk: s.automationRisk,
        marketCap: s.marketCap,
        ticker: s.ticker,
        market: s.market,
    }));

    return (
        <div className="panel">
            <div className="panel-header">
                <div className="panel-title">
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--red)", display: "inline-block" }} />
                    AI Vulnerability Heatmap
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <div className="badge badge-amber">NIFTY</div>
                    <div className="badge badge-red">LIVE</div>
                </div>
            </div>
            <div className={styles.body} ref={containerRef}>
                {dims.width > 0 && dims.height > 0 && (
                    <Treemap
                        width={dims.width}
                        height={dims.height}
                        data={treeData}
                        dataKey="value"
                        aspectRatio={16 / 6}
                        content={<CustomContent />}
                        isAnimationActive={true}
                        animationDuration={600}
                    >
                        <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                )}
            </div>
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: "#ff3b5c" }} />
                    Critical (80+)
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: "#ff6b35" }} />
                    High (60-79)
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: "#ffb84d" }} />
                    Moderate (40-59)
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: "#4d9fff" }} />
                    Low (25-39)
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: "#00ff88" }} />
                    Minimal (&lt;25)
                </div>
            </div>
        </div>
    );
}

// ============================================
// MarketMind — Component Registry
// Maps tool names → React components for Generative UI
// ============================================

import SectorComparison from "@/components/generative/SectorComparison";
import EarningsTable from "@/components/generative/EarningsTable";
import MarketOverview from "@/components/generative/MarketOverview";
import MetricCard from "@/components/generative/MetricCard";
import NewsFeed from "@/components/generative/NewsFeed";
import type { ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENT_REGISTRY: Record<string, ComponentType<{ data: any }>> = {
    showSectorAnalysis: SectorComparison,
    showEarningsReport: EarningsTable,
    showMarketOverview: MarketOverview,
    showMetric: MetricCard,
    showNews: NewsFeed,
};

export const TOOL_LABELS: Record<string, string> = {
    showSectorAnalysis: "Loading sector analysis…",
    showEarningsReport: "Fetching earnings data…",
    showMarketOverview: "Loading market indices…",
    showMetric: "Preparing metric…",
    showNews: "Fetching news…",
};

// ============================================
// MarketMind — LangGraph Agent State
// Shared state schema for multi-agent pipeline
// ============================================

import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import type { DocumentChunk } from "@/lib/vector-store";

// ── Agent Names ──
export type AgentName = "supervisor" | "quantitative" | "qualitative" | "research" | "synthesis";

// ── Routing Decision ──
export type RoutingDecision = {
    agents: AgentName[];
    reasoning: string;
    queryType: "QUANTITATIVE" | "QUALITATIVE" | "MIXED" | "RESEARCH" | "FULL" | "DIRECT";
};

// ── Sentiment Result ──
export type SentimentResult = {
    overallSentiment: "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED";
    sectorSentiments: Array<{
        sector: string;
        sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
        reasoning: string;
    }>;
    narrative: string;
    crossMarketInsight: string;
};

// ── Graph State ──
export const MarketMindState = Annotation.Root({
    // Conversation
    messages: Annotation<BaseMessage[]>({
        reducer: (prev, next) => [...prev, ...next],
        default: () => [],
    }),
    currentQuery: Annotation<string>({
        reducer: (_prev, next) => next,
        default: () => "",
    }),

    // Agent routing
    routingDecision: Annotation<RoutingDecision | null>({
        reducer: (_prev, next) => next,
        default: () => null,
    }),
    activeAgents: Annotation<AgentName[]>({
        reducer: (_prev, next) => next,
        default: () => [],
    }),
    completedAgents: Annotation<AgentName[]>({
        reducer: (prev, next) => [...prev, ...next],
        default: () => [],
    }),

    // Data (deterministic — from Quantitative agent)
    graphqlData: Annotation<Record<string, unknown> | null>({
        reducer: (_prev, next) => next,
        default: () => null,
    }),

    // Analysis (probabilistic — from Qualitative agent)
    sentimentAnalysis: Annotation<SentimentResult | null>({
        reducer: (_prev, next) => next,
        default: () => null,
    }),

    // Research (RAG — from Research agent)
    retrievedChunks: Annotation<DocumentChunk[]>({
        reducer: (_prev, next) => next,
        default: () => [],
    }),

    // Output (from Synthesis agent)
    synthesisPrompt: Annotation<string>({
        reducer: (_prev, next) => next,
        default: () => "",
    }),

    // Pipeline metadata
    agentPipeline: Annotation<string[]>({
        reducer: (prev, next) => [...prev, ...next],
        default: () => [],
    }),
});

export type MarketMindStateType = typeof MarketMindState.State;

// ============================================
// MarketMind — Research Agent
// RAG retrieval via vector store (Pinecone / in-memory)
// ============================================

import { getVectorStore, type DocumentChunk } from "@/lib/vector-store";
import type { MarketMindStateType } from "./state";
import { withTimeout } from "./timeout";

const RESEARCH_TIMEOUT_MS = 3000;

// Sector detection for metadata filtering
function detectSectorFilter(query: string): string | null {
    const lower = query.toLowerCase();
    const sectorMap: Record<string, string> = {
        transport: "Transportation & Logistics",
        logistics: "Transportation & Logistics",
        trucking: "Transportation & Logistics",
        autonomous: "Transportation & Logistics",
        financial: "Financial Services",
        banking: "Financial Services",
        bank: "Financial Services",
        retail: "Retail & E-Commerce",
        "e-commerce": "Retail & E-Commerce",
        ecommerce: "Retail & E-Commerce",
        amazon: "Retail & E-Commerce",
        healthcare: "Healthcare Admin",
        health: "Healthcare Admin",
        media: "Media & Entertainment",
        entertainment: "Media & Entertainment",
        manufacturing: "Manufacturing",
        tesla: "Manufacturing",
        energy: "Energy & Utilities",
        power: "Energy & Utilities",
        biotech: "Biotech & Pharma",
        pharma: "Biotech & Pharma",
        drug: "Biotech & Pharma",
        defense: "Defense & Aerospace",
        aerospace: "Defense & Aerospace",
        "it services": "IT Services",
        tcs: "IT Services",
        infosys: "IT Services",
        wipro: "IT Services",
        hcl: "IT Services",
    };

    for (const [keyword, sector] of Object.entries(sectorMap)) {
        if (lower.includes(keyword)) return sector;
    }
    return null;
}

function detectMarketFilter(query: string): string | null {
    const lower = query.toLowerCase();
    if (
        lower.includes("india") ||
        lower.includes("indian") ||
        lower.includes("nifty") ||
        lower.includes("nse")
    ) {
        return "IN";
    }
    if (
        /\bus\b/.test(lower) ||
        lower.includes("american") ||
        lower.includes("s&p") ||
        lower.includes("nasdaq")
    ) {
        return "US";
    }
    return null;
}

export async function researchNode(
    state: MarketMindStateType
): Promise<Partial<MarketMindStateType>> {
    const fallbackResult: Partial<MarketMindStateType> = {
        retrievedChunks: [],
        completedAgents: ["research"],
        agentPipeline: ["🔍 Research (timeout)"],
    };

    return withTimeout(
        runResearch(state),
        RESEARCH_TIMEOUT_MS,
        fallbackResult
    );
}

async function runResearch(
    state: MarketMindStateType
): Promise<Partial<MarketMindStateType>> {
    const query = state.currentQuery;

    try {
        const store = getVectorStore();

        // Build metadata filter
        const filter: Record<string, string> = {};
        const sector = detectSectorFilter(query);
        const market = detectMarketFilter(query);
        if (sector) filter.sector = sector;
        if (market) filter.market = market;

        // Search with filter if specific, without filter if broad
        let chunks: DocumentChunk[];
        if (Object.keys(filter).length > 0) {
            // Try filtered first, fall back to unfiltered if no results
            chunks = await store.search(query, 5, filter);
            if (chunks.length < 2) {
                const unfiltered = await store.search(query, 5);
                chunks = [...chunks, ...unfiltered]
                    .filter(
                        (c, i, arr) =>
                            arr.findIndex((x) => x.title === c.title) === i
                    )
                    .slice(0, 5);
            }
        } else {
            chunks = await store.search(query, 5);
        }

        console.log(
            `[Research Agent] Retrieved ${chunks.length} chunks for: "${query.slice(0, 50)}..."`
        );

        return {
            retrievedChunks: chunks,
            completedAgents: ["research"],
            agentPipeline: ["🔍 Research"],
        };
    } catch (error) {
        console.error("[Research Agent] Error:", error);
        return {
            retrievedChunks: [],
            completedAgents: ["research"],
            agentPipeline: ["🔍 Research (error)"],
        };
    }
}

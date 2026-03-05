// ============================================
// MarketMind — LangGraph Agent Graph
// Assembles the multi-agent StateGraph pipeline
// ============================================

import { StateGraph, END, START } from "@langchain/langgraph";
import { MarketMindState } from "./state";
import { supervisorNode } from "./supervisor";
import { quantitativeNode } from "./quantitative";
import { qualitativeNode } from "./qualitative";
import { researchNode } from "./research";
import { synthesisNode } from "./synthesis";

// ── Conditional Router ──
// After the Supervisor, route based on the routing decision
function routeAfterSupervisor(state: typeof MarketMindState.State): string {
    const decision = state.routingDecision;

    if (!decision) return "synthesis"; // Fallback

    switch (decision.queryType) {
        case "QUANTITATIVE":
            return "quantitative";
        case "QUALITATIVE":
            return "quantitative"; // Always fetch data first, even for qualitative
        case "MIXED":
            return "quantitative";
        case "RESEARCH":
            return "research"; // Research-only queries skip data fetching
        case "FULL":
            return "quantitative"; // Full pipeline starts with data
        case "DIRECT":
            return "synthesis";
        default:
            return "quantitative";
    }
}

// After Quantitative, decide whether to run Qualitative, Research, or skip to Synthesis
function routeAfterQuantitative(state: typeof MarketMindState.State): string {
    const decision = state.routingDecision;

    if (!decision) return "synthesis";

    if (decision.queryType === "FULL") {
        return "qualitative"; // Full pipeline: quant → qual → research → synthesis
    }

    if (decision.queryType === "MIXED" || decision.queryType === "QUALITATIVE") {
        return "qualitative";
    }

    // Check if research was requested alongside quantitative
    if (decision.agents.includes("research")) {
        return "research";
    }

    // QUANTITATIVE only — skip to synthesis
    return "synthesis";
}

// After Qualitative, decide whether to run Research or skip to Synthesis
function routeAfterQualitative(state: typeof MarketMindState.State): string {
    const decision = state.routingDecision;

    if (!decision) return "synthesis";

    // If FULL pipeline or Research was explicitly requested
    if (
        decision.queryType === "FULL" ||
        decision.agents.includes("research")
    ) {
        return "research";
    }

    return "synthesis";
}

// ── Build Graph ──
export function buildMarketMindGraph() {
    const graph = new StateGraph(MarketMindState)
        // Add all agent nodes
        .addNode("supervisor", supervisorNode)
        .addNode("quantitative", quantitativeNode)
        .addNode("qualitative", qualitativeNode)
        .addNode("research", researchNode)
        .addNode("synthesis", synthesisNode)

        // Entry point
        .addEdge(START, "supervisor")

        // Supervisor → conditional routing
        .addConditionalEdges("supervisor", routeAfterSupervisor, {
            quantitative: "quantitative",
            research: "research",
            synthesis: "synthesis",
        })

        // Quantitative → conditional (qualitative, research, or synthesis)
        .addConditionalEdges("quantitative", routeAfterQuantitative, {
            qualitative: "qualitative",
            research: "research",
            synthesis: "synthesis",
        })

        // Qualitative → conditional (research or synthesis)
        .addConditionalEdges("qualitative", routeAfterQualitative, {
            research: "research",
            synthesis: "synthesis",
        })

        // Research → always goes to synthesis
        .addEdge("research", "synthesis")

        // Synthesis → end
        .addEdge("synthesis", END);

    return graph.compile();
}

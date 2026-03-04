// ============================================
// MarketMind — LangGraph Agent Graph
// Assembles the multi-agent StateGraph pipeline
// ============================================

import { StateGraph, END, START } from "@langchain/langgraph";
import { MarketMindState } from "./state";
import { supervisorNode } from "./supervisor";
import { quantitativeNode } from "./quantitative";
import { qualitativeNode } from "./qualitative";
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
        case "DIRECT":
            return "synthesis";
        default:
            return "quantitative";
    }
}

// After Quantitative, decide whether to run Qualitative or skip to Synthesis
function routeAfterQuantitative(state: typeof MarketMindState.State): string {
    const decision = state.routingDecision;

    if (!decision) return "synthesis";

    if (decision.queryType === "MIXED" || decision.queryType === "QUALITATIVE") {
        return "qualitative";
    }

    // QUANTITATIVE only — skip qualitative
    return "synthesis";
}

// ── Build Graph ──
export function buildMarketMindGraph() {
    const graph = new StateGraph(MarketMindState)
        // Add all agent nodes
        .addNode("supervisor", supervisorNode)
        .addNode("quantitative", quantitativeNode)
        .addNode("qualitative", qualitativeNode)
        .addNode("synthesis", synthesisNode)

        // Entry point
        .addEdge(START, "supervisor")

        // Supervisor → conditional routing
        .addConditionalEdges("supervisor", routeAfterSupervisor, {
            quantitative: "quantitative",
            synthesis: "synthesis",
        })

        // Quantitative → conditional (qualitative or synthesis)
        .addConditionalEdges("quantitative", routeAfterQuantitative, {
            qualitative: "qualitative",
            synthesis: "synthesis",
        })

        // Qualitative → always goes to synthesis
        .addEdge("qualitative", "synthesis")

        // Synthesis → end
        .addEdge("synthesis", END);

    return graph.compile();
}

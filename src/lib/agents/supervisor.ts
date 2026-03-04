// ============================================
// MarketMind — Supervisor Agent
// Intent classifier + router for multi-agent pipeline
// ============================================

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { MarketMindStateType, RoutingDecision } from "./state";

const ROUTING_SYSTEM_PROMPT = `You are the Supervisor agent for MarketMind, a financial analysis system. Your job is to classify user queries and decide which specialist agents should handle them.

Available agents:
1. QUANTITATIVE — For queries needing market data: sector analysis, earnings reports, market indices, stock prices, company financials. This agent fetches deterministic data.
2. QUALITATIVE — For queries needing sentiment analysis, news interpretation, narrative context, cross-market comparisons, or deeper commentary on WHY metrics matter.
3. DIRECT — For simple greetings, meta-questions about MarketMind, or queries that don't need any data lookup.

Routing rules:
- If the user asks about specific data (sectors, earnings, indices, news), route to QUANTITATIVE.
- If the user asks "why" or wants analysis/sentiment, also route to QUALITATIVE.
- Most substantive queries should go to both QUANTITATIVE + QUALITATIVE (MIXED) for the richest response.
- Only use DIRECT for greetings, help requests, or meta-questions.

Respond with valid JSON only:
{
  "queryType": "QUANTITATIVE" | "QUALITATIVE" | "MIXED" | "DIRECT",
  "agents": ["supervisor", "quantitative", "qualitative", "synthesis"],
  "reasoning": "brief explanation of routing decision"
}

Always include "supervisor" and "synthesis" in agents. Add "quantitative" and/or "qualitative" based on queryType.`;

export async function supervisorNode(
    state: MarketMindStateType
): Promise<Partial<MarketMindStateType>> {
    const model = new ChatOpenAI({
        modelName: process.env.OPENAI_MODEL || "gpt-4o",
        temperature: 0,
        maxTokens: 200,
    });

    const response = await model.invoke([
        new SystemMessage(ROUTING_SYSTEM_PROMPT),
        new HumanMessage(state.currentQuery),
    ]);

    let routing: RoutingDecision;

    try {
        const content = typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

        // Extract JSON from potential markdown code fences
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");

        const parsed = JSON.parse(jsonMatch[0]);
        routing = {
            queryType: parsed.queryType || "MIXED",
            agents: parsed.agents || ["supervisor", "quantitative", "qualitative", "synthesis"],
            reasoning: parsed.reasoning || "Default routing",
        };
    } catch {
        // Default to MIXED routing on parse failure
        routing = {
            queryType: "MIXED",
            agents: ["supervisor", "quantitative", "qualitative", "synthesis"],
            reasoning: "Fallback: could not parse routing decision, using full pipeline",
        };
    }

    return {
        routingDecision: routing,
        activeAgents: routing.agents,
        completedAgents: ["supervisor"],
        agentPipeline: ["🧠 Supervisor"],
    };
}

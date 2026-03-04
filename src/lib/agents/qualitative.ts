// ============================================
// MarketMind — Qualitative Agent
// Sentiment analysis + narrative interpretation
// ============================================

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { MarketMindStateType, SentimentResult } from "./state";

const QUALITATIVE_SYSTEM_PROMPT = `You are the Qualitative Analysis agent for MarketMind. Your role is to analyze market data and provide sentiment analysis, narrative context, and cross-market insights.

You will receive:
1. The user's query
2. Raw market data (sectors, earnings, indices, news) fetched by the Quantitative agent

Your job is to produce a JSON analysis with:
- overallSentiment: "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED"
- sectorSentiments: array of { sector, sentiment, reasoning } for relevant sectors
- narrative: 2-3 sentences explaining the WHY behind the data patterns
- crossMarketInsight: 1-2 sentences about US-India cross-market dynamics (if relevant, otherwise "N/A")

Focus on:
- Why certain sectors are vulnerable or resilient to AI disruption
- Earnings surprise patterns and what they signal
- How AI adoption is creating winners and losers
- The gap between vulnerability scores and actual performance (mispricings)

Respond with valid JSON only. Be provocative and data-driven in your analysis.`;

export async function qualitativeNode(
    state: MarketMindStateType
): Promise<Partial<MarketMindStateType>> {
    const model = new ChatOpenAI({
        modelName: process.env.OPENAI_MODEL || "gpt-4o",
        temperature: 0.4,
        maxTokens: 500,
    });

    const dataContext = state.graphqlData
        ? JSON.stringify(state.graphqlData, null, 2).slice(0, 3000) // Limit context size
        : "No data available";

    const response = await model.invoke([
        new SystemMessage(QUALITATIVE_SYSTEM_PROMPT),
        new HumanMessage(
            `User query: "${state.currentQuery}"\n\nMarket data:\n${dataContext}`
        ),
    ]);

    let sentiment: SentimentResult;

    try {
        const content = typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content);

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");

        const parsed = JSON.parse(jsonMatch[0]);
        sentiment = {
            overallSentiment: parsed.overallSentiment || "NEUTRAL",
            sectorSentiments: parsed.sectorSentiments || [],
            narrative: parsed.narrative || "",
            crossMarketInsight: parsed.crossMarketInsight || "N/A",
        };
    } catch {
        sentiment = {
            overallSentiment: "NEUTRAL",
            sectorSentiments: [],
            narrative: "Unable to generate qualitative analysis for this query.",
            crossMarketInsight: "N/A",
        };
    }

    return {
        sentimentAnalysis: sentiment,
        completedAgents: ["qualitative"],
        agentPipeline: ["📰 Qualitative"],
    };
}

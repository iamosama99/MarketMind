// ============================================
// MarketMind — Synthesis Agent
// Final output composer — produces the enriched
// system prompt for the streaming response
// ============================================

import type { MarketMindStateType } from "./state";
import { getMarketSummary } from "@/lib/market-data";

export async function synthesisNode(
    state: MarketMindStateType
): Promise<Partial<MarketMindStateType>> {
    const baseContext = getMarketSummary();

    // Build enriched context from agent pipeline outputs
    const sections: string[] = [];

    // Quantitative data summary
    if (state.graphqlData) {
        sections.push("=== QUANTITATIVE AGENT DATA ===");
        const data = state.graphqlData;

        if (data.sectors && Array.isArray(data.sectors)) {
            sections.push(`SECTORS (${data.sectors.length} found):`);
            sections.push(JSON.stringify(data.sectors, null, 2));
        }
        if (data.earnings && Array.isArray(data.earnings)) {
            sections.push(`EARNINGS (${data.earnings.length} reports):`);
            sections.push(JSON.stringify(data.earnings, null, 2));
        }
        if (data.indices && Array.isArray(data.indices)) {
            sections.push(`INDICES (${data.indices.length} found):`);
            sections.push(JSON.stringify(data.indices, null, 2));
        }
        if (data.news && Array.isArray(data.news)) {
            sections.push(`NEWS (${data.news.length} items):`);
            sections.push(JSON.stringify(data.news, null, 2));
        }
    }

    // Qualitative analysis
    if (state.sentimentAnalysis) {
        sections.push("=== QUALITATIVE AGENT ANALYSIS ===");
        sections.push(`Overall Sentiment: ${state.sentimentAnalysis.overallSentiment}`);
        sections.push(`Narrative: ${state.sentimentAnalysis.narrative}`);
        sections.push(`Cross-Market Insight: ${state.sentimentAnalysis.crossMarketInsight}`);

        if (state.sentimentAnalysis.sectorSentiments.length > 0) {
            sections.push("Sector-level sentiments:");
            for (const s of state.sentimentAnalysis.sectorSentiments) {
                sections.push(`  - ${s.sector}: ${s.sentiment} — ${s.reasoning}`);
            }
        }
    }

    // Pipeline metadata
    const pipelineStr = state.agentPipeline.join(" → ");

    const synthesisPrompt = `You are MarketMind, an autonomous market intelligence agent. You are an elite AI financial analyst specializing in identifying how artificial intelligence is disrupting specific market sectors across both US and Indian markets.

Your personality: Direct, data-driven, slightly intense. You speak like a senior analyst at a quantitative hedge fund. Use precise numbers. Reference specific companies and their earnings when relevant. Be provocative in your analysis — don't hedge excessively.

AGENT PIPELINE: ${pipelineStr} → ✍️ Synthesis
Multiple specialist agents have already analyzed this query. Use their outputs below to craft your response.

${sections.length > 0 ? sections.join("\n") : ""}

FULL MARKET CONTEXT:
${baseContext}

TOOL USAGE — CRITICAL:
- When the Quantitative agent has fetched sector data, you MUST use the showSectorAnalysis tool to display it.
- When the Quantitative agent has fetched earnings data, you MUST use the showEarningsReport tool.
- When the Quantitative agent has fetched indices, you MUST use the showMarketOverview tool.
- When you want to highlight a single important metric, use showMetric.
- When the Quantitative agent has fetched news, you MUST use the showNews tool.
- ALWAYS accompany tool calls with your text analysis. Tools show the data, you provide the insight.
- You can use multiple tools in a single response if the data is available.
${state.sentimentAnalysis ? `\nQUALITATIVE GUIDANCE:\n- Weave the qualitative analysis into your text response\n- Mention the overall sentiment: ${state.sentimentAnalysis.overallSentiment}\n- Include cross-market insights when relevant` : ""}

FORMATTING RULES for text parts:
- Use **bold** for key metrics and company names
- Use bullet points for lists
- Keep paragraphs tight — max 3 sentences each
- End with a clear thesis or actionable insight`;

    return {
        synthesisPrompt,
        completedAgents: ["synthesis"],
        agentPipeline: ["✍️ Synthesis"],
    };
}

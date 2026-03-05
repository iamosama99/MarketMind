// ============================================
// MarketMind — Knowledge Base (Research Documents)
// Mock analyst reports, sector analyses, and
// AI disruption research for RAG retrieval
// ============================================

export interface ResearchDocument {
    id: string;
    title: string;
    content: string;
    source: string;
    sector: string;
    market: "US" | "IN" | "GLOBAL";
    date: string;
    documentType: "report" | "analysis" | "whitepaper" | "note";
}

export function getResearchDocuments(): ResearchDocument[] {
    return [
        // ── AI Vulnerability Methodology ──
        {
            id: "doc-001",
            title: "AI Vulnerability Scoring Framework v3.2",
            content: `The MarketMind AI Vulnerability Score (AVS) is a composite metric ranging from 0-100 that quantifies a sector's exposure to disruption from artificial intelligence and automation technologies.

The AVS is calculated using five weighted factors:
1. Task Automability Index (30%): Percentage of core tasks in the sector that can be automated using current or near-term AI capabilities. Based on O*NET task descriptions cross-referenced with AI capability benchmarks.
2. Labor Cost Sensitivity (20%): Ratio of labor costs to total operating expenses. Sectors with higher labor intensity face greater disruption potential when AI can substitute human workers.
3. Data Digitization Maturity (20%): Degree to which the sector's workflows are already digitized, creating the data infrastructure necessary for AI deployment. Paradoxically, more digitized sectors are MORE vulnerable because the data foundation already exists.
4. Competitive Pressure Score (15%): Market concentration and competitive dynamics that incentivize early AI adoption. Highly competitive sectors adopt AI faster as a survival mechanism.
5. Regulatory Moat (15%): Degree of regulatory protection that slows AI adoption. Healthcare and defense have higher regulatory moats; retail and media have minimal barriers.

The calibration was performed against historical disruption events: e-commerce's impact on retail (2010-2020), algorithmic trading's impact on financial services (2005-2015), and streaming's impact on media (2015-2025). The model correctly retroactively predicted 87% of sector disruption magnitudes within a 10-point margin.

Critical insight: Sectors scoring above 75 typically experience measurable revenue disruption within 18-24 months. Transportation & Logistics (AVS: 89) is currently in the "pre-disruption window" where autonomous vehicle deployment will trigger rapid value destruction in traditional logistics chains.`,
            source: "MarketMind Research",
            sector: "Cross-Sector",
            market: "GLOBAL",
            date: "2026-01-15",
            documentType: "whitepaper",
        },
        {
            id: "doc-002",
            title: "Transportation & Logistics: The Autonomous Disruption Thesis",
            content: `Transportation & Logistics carries the highest AI Vulnerability Score (89/100) across all tracked sectors. The thesis rests on three converging forces:

1. Autonomous Trucking Timeline Compression: Waymo, Aurora, and TuSimple have collectively logged over 50 million autonomous miles. Waymo's partnership with FedEx for middle-mile delivery has moved from pilot to scheduled routes across Texas and Arizona. Cost per mile for autonomous trucks is now $1.12 vs $1.76 for human-operated trucks, a 36% cost advantage that will widen as technology scales.

2. Last-Mile Robotics: Amazon's deployment of 750,000 warehouse robots has reduced per-unit fulfillment costs by 28%. FedEx's Q4 miss (revenue $22.1B vs $23.4B estimate) directly correlates with volume migration to AI-optimized logistics networks. The company's -9.1% post-earnings price drop reflects the market pricing in structural disruption, not a cyclical downturn.

3. Route Optimization AI: Machine learning route optimization reduces fuel costs by 15-20% and delivery times by 12%. Companies not deploying these systems are becoming cost-uncompetitive at an accelerating rate.

The sector's CRITICAL automation risk classification implies that >60% of current industry revenue is addressable by AI within 5 years. FedEx's strategic response — investing $2B in autonomous fleet technology — may be too late given Waymo's 3-year head start in the autonomous middle-mile segment.

Investment implication: Short traditional logistics operators with high human-driver dependency. Long technology-forward operators and autonomous vehicle pure-plays.`,
            source: "Goldman Sachs Research",
            sector: "Transportation & Logistics",
            market: "US",
            date: "2026-02-10",
            documentType: "report",
        },
        {
            id: "doc-003",
            title: "Financial Services: AI as Both Threat and Weapon",
            content: `Financial Services (AVS: 82/100) presents a unique dual-dynamic: AI simultaneously threatens traditional roles while creating massive competitive advantages for early adopters.

Threat Vector — Job Displacement:
Goldman Sachs estimates 300,000 financial analyst positions are at risk from AI automation by 2028. The core vulnerability is in data synthesis and report generation — tasks that GPT-4 class models can perform at 90% of human analyst quality at 1% of the cost. JP Morgan's COiN platform already automates 360,000 hours of legal document review annually.

Weapon Vector — AI-Enhanced Alpha:
JPMorgan Chase's Q4 results (revenue $44.2B, beating estimates by $400M) demonstrate the AI advantage. The bank's AI-powered fraud detection system prevented $2.1B in fraudulent transactions in 2025, a 340% improvement over rules-based systems. CEO Jamie Dimon referenced AI 42 times in the earnings call — the highest among financial sector CEOs.

The competitive bifurcation is stark: banks investing >$1B annually in AI (JPM, GS, MS) are seeing 15-20% efficiency gains, while regional banks spending <$100M are losing market share at 3-4% per year.

Indian parallel: HDFC Bank's AI-powered credit underwriting has cut processing time by 60% and reduced default rates by 23%. This positions Indian private banks as potential acquirers of smaller banks that cannot afford AI transformation.

Key metric: Financial institutions that have deployed AI see a 2.3x higher return on equity compared to non-AI peers. This gap is widening by 0.4x per year.`,
            source: "Morgan Stanley Research",
            sector: "Financial Services",
            market: "GLOBAL",
            date: "2026-02-05",
            documentType: "report",
        },
        {
            id: "doc-004",
            title: "Indian IT Services: The GenAI Cannibalization Risk",
            content: `India's IT Services sector (AVS: 78/100) faces an existential paradox: the companies that built the global outsourcing industry are now threatened by the very AI technologies they are paid to implement.

The Revenue Cannibalization Model:
TCS, Infosys, Wipro, and HCL Tech collectively employ 1.6 million engineers. Their business model is fundamentally labor-arbitrage — selling Indian developer hours at lower cost than Western alternatives. GenAI directly attacks this model:
- Code generation tools (GitHub Copilot, Amazon CodeWhisperer) reduce developer productivity requirements by 30-40%
- Automated testing frameworks eliminate 50% of QA headcount needs
- AI-powered documentation and maintenance reduce support team sizes by 25%

TCS's Q3 warning that GenAI "reduced billable headcount by 8%" was the sector's canary-in-the-coal-mine moment. Revenue grew 0.8% YoY — the lowest in 15 years — despite a 12% increase in deal bookings. The math is clear: deals are getting larger but requiring fewer people.

Infosys's counter-strategy is notable: the company's "AI-first delivery model" explicitly aims for 30% productivity improvement, effectively admitting that future growth comes from doing more with fewer people. This is smart but means revenue-per-employee must rise faster than headcount falls.

HCL Tech is the outlier: its product-focused strategy (DRYiCE AI platform) positions it as a tools provider rather than a labor provider. HCL's 3.43% earnings surprise and 3.1% post-earnings price gain reflect market approval of this pivot.

Wipro's Q3 miss (revenue ₹22.3K Cr vs ₹22.8K Cr estimate, -5.20% EPS surprise) illustrates the downside: companies that neither pivot to AI-first delivery nor develop proprietary AI tools face margin erosion from both ends — clients demanding AI productivity gains while competitors deliver them.

The NIFTY IT index decline of -1.74% reflects this structural anxiety. We project a bifurcation: AI-forward IT companies (Infosys, HCL) will maintain 8-12% margins while laggards (Wipro, Tech Mahindra) face margin compression to 4-6% by 2028.`,
            source: "CLSA Asia-Pacific Markets",
            sector: "IT Services",
            market: "IN",
            date: "2026-02-20",
            documentType: "analysis",
        },
        {
            id: "doc-005",
            title: "NVIDIA: The AI Infrastructure Monopoly Thesis",
            content: `NVIDIA (NVDA) continues to demonstrate monopolistic pricing power in AI infrastructure. Q4 FY2026 results shattered expectations: revenue of $35.1B (+5.95% beat), EPS of $0.89 (+5.95% beat), with 147 AI mentions in the earnings call — more than any other company in our coverage universe.

The Competitive Moat Analysis:
1. CUDA Ecosystem Lock-in: 4.7 million developers trained on CUDA create an switching cost that AMD and Intel cannot overcome with superior hardware alone. NVIDIA's software moat is arguably more valuable than its hardware advantage.
2. Data Center Dominance: 92% market share in AI training chips. The Blackwell architecture delivers 4x training performance per watt vs. H100, raising the bar for competitors.
3. Hyperscaler Dependency: Microsoft, Google, Amazon, and Meta collectively ordered $48B of NVIDIA GPUs in 2025. These orders represent 18-24 month forward demand visibility.

Revenue Trajectory:
- Data Center revenue: $28.4B (+87% YoY) — driven by Blackwell ramp
- Gaming revenue: $3.6B (+9% YoY) — stable but no longer the growth driver
- Automotive: $1.1B (+103% YoY) — NVIDIA DRIVE platform gaining traction

The bear case centers on customer concentration risk: the top 4 hyperscalers represent 62% of revenue. If any major customer develops competitive in-house chips (Google TPU, Amazon Trainium), NVIDIA's growth rate could decelerate. However, the CUDA ecosystem lock-in makes full substitution unlikely within a 3-year horizon.

Price target: We maintain our $185 target, implying 22% upside from current levels. The 8.2% post-earnings price surge validates the AI investment thesis.`,
            source: "Bank of America Merrill Lynch",
            sector: "Technology",
            market: "US",
            date: "2026-02-27",
            documentType: "report",
        },
        {
            id: "doc-006",
            title: "Healthcare AI: Regulatory Moat Delays Disruption",
            content: `Healthcare Administration (AVS: 71/100) occupies an interesting position: high theoretical automability but significant regulatory barriers slowing AI adoption.

The Automability Gap:
Claims processing, medical coding, prior authorization, and appointment scheduling are all highly automatable tasks that comprise 40% of healthcare administrative costs ($1.2 trillion annually in the US). AI can reduce these costs by 30-50%, representing a $360-600B addressable opportunity.

Why the Moat Matters:
HIPAA compliance, FDA approval pathways, and state-level healthcare regulations create 2-4 year implementation lags compared to unregulated sectors. UnitedHealth Group (UNH) — the largest US health insurer — reported Q4 revenue of $100.8B (beating estimates) with only 31 AI mentions in the earnings call. This low AI mention count relative to revenue scale suggests the company views AI as operational improvement rather than existential threat.

The Emerging Reality:
Despite regulatory friction, three AI applications are gaining rapid traction:
1. AI-assisted diagnostics (radiology AI achieves 94% accuracy vs 88% for human radiologists)
2. Automated prior authorization (reduces processing from 14 days to 4 hours)
3. Predictive patient risk scoring (reduces hospital readmission rates by 26%)

UnitedHealth's 0.4% sector performance reflects this moderate disruption profile — positive but not explosive growth, as AI augments rather than replaces healthcare workers.

Investment implication: Healthcare AI plays should be viewed as 3-5 year positions. The regulatory moat protects incumbents in the short term but creates massive value for first-movers who navigate compliance successfully.`,
            source: "Jefferies Research",
            sector: "Healthcare Admin",
            market: "US",
            date: "2026-02-08",
            documentType: "analysis",
        },
        {
            id: "doc-007",
            title: "Media & Entertainment: Generative AI Reshapes Content Economics",
            content: `Media & Entertainment (AVS: 68/100) is experiencing the most visible consumer-facing AI disruption. OpenAI's Sora 2 launch triggered a 12% drop in WPP shares — a clear signal that the market is pricing in structural change for content creation industries.

The Content Cost Revolution:
Generative AI is collapsing the cost curve for content production:
- Video production: AI-generated B-roll reduces production costs by 40-60%
- Copywriting: GPT-4 class models produce marketing copy at $0.02 per 1000 words vs $150-500 for human copywriters
- Music production: AI composition tools create production-quality background music in minutes vs days
- Visual effects: AI-powered VFX reduces post-production timelines by 70%

Meta Platforms (META) is the sector's AI winner: Q4 revenue of $46.7B (+5.18% beat) with 112 AI mentions reflects the company's pivot to AI-driven content recommendation and ad targeting. Meta's Advantage+ AI ad system generates 32% higher ROAS (return on ad spend) compared to human-curated campaigns.

The Losers:
Traditional media companies — WPP, Omnicom, IPG — face the most acute threat. Their business model of selling human creative hours is directly undermined by generative AI. We estimate 35% of advertising agency revenue is at risk of AI substitution within 3 years.

Indian Media Market:
India's media sector is less exposed due to language diversity creating a natural moat — AI content generation in Hindi, Tamil, Telugu, and other regional languages lags English capabilities by 12-18 months. However, this gap is closing rapidly with multilingual models.`,
            source: "Bernstein Research",
            sector: "Media & Entertainment",
            market: "GLOBAL",
            date: "2026-02-15",
            documentType: "report",
        },
        {
            id: "doc-008",
            title: "Defense & Aerospace: AI as Force Multiplier, Not Disruptor",
            content: `Defense & Aerospace (AVS: 15/100) has the lowest AI vulnerability score in our coverage universe, driven by massive regulatory barriers, classified technology requirements, and government procurement cycles that inherently resist rapid disruption.

Why Defense is AI-Resilient:
1. Security Clearance Moat: AI systems handling classified data require ITAR compliance and facility security clearances that take 2-5 years to establish. This effectively blocks new AI-native entrants.
2. Procurement Cycles: DoD procurement cycles average 7-10 years from requirement to deployment. Even transformative AI technologies face this timeline friction.
3. Human-in-the-Loop Requirements: Current DoD policy (DoD Directive 3000.09) requires human authorization for lethal autonomous weapons systems, limiting full automation.

Lockheed Martin (LMT) exemplifies the AI-as-augmentation model: Q4 revenue of $18.9B with only 18 AI mentions, but a $4.2B AI-enhanced defense contract with the Pentagon demonstrates that AI investment flows through traditional defense contractors rather than disrupting them.

The 4.7% positive sector performance reflects investor confidence that defense companies will be AI beneficiaries rather than victims. The sector's LOW automation risk classification means AI creates new revenue streams (autonomous drones, AI-powered threat detection, predictive maintenance) without cannibalizing existing ones.

Investment implication: Defense is a hedge against AI disruption in a portfolio context. When AI anxiety drives rotation out of high-AVS sectors, capital flows into defense as a safe haven with AI upside optionality.`,
            source: "Cowen Defense Research",
            sector: "Defense & Aerospace",
            market: "US",
            date: "2026-02-12",
            documentType: "analysis",
        },
        {
            id: "doc-009",
            title: "US-India Cross-Market AI Adoption Gap Analysis",
            content: `The divergence between US and Indian market AI adoption trajectories creates significant cross-market investment opportunities.

AI Adoption Index (AAI) by Market:
US Market AAI: 72/100 — Driven by hyperscaler capex ($180B cumulative AI investment in 2025) and startup ecosystem depth. Enterprise AI adoption at 65% among Fortune 500.
India Market AAI: 41/100 — Concentrated in IT Services, Banking, and Telecom. Broader enterprise adoption at 28%, limited by infrastructure gaps and talent distribution.

The Gap Creates Opportunity:
1. Indian IT as AI Barometer: When US companies accelerate AI adoption, Indian IT services initially benefit (implementation contracts) before facing cannibalization (automation reduces ongoing maintenance revenue). Current data shows this inflection point has arrived: deal bookings up 12% but billable headcount down 8%.

2. Banking Convergence: HDFC Bank's AI adoption mirrors JPMorgan's trajectory with a 2-3 year lag. HDFC's 60% credit processing time reduction through AI suggests Indian private banks will see US-level efficiency gains by 2028, creating a valuation re-rating opportunity.

3. The Regulatory Delta: India's looser AI regulation (compared to EU AI Act and evolving US frameworks) creates a "regulatory arbitrage" for AI deployment in fintech, healthtech, and agritech. Companies like Reliance Jio are deploying AI across telecom, retail, and media with minimal regulatory friction.

NIFTY 50 (-0.55%) vs S&P 500 (+0.38%) divergence reflects the market pricing in India's structural AI challenges (IT Services headwinds) despite the broader economic growth story. We project this gap will narrow as Indian companies complete their AI transformations by late 2027.

Key trade: Long Indian banks (HDFC, ICICI) as AI adoption re-rates valuations toward US peers. Short Indian IT Services that haven't articulated clear AI-first strategies (Wipro, Tech Mahindra).`,
            source: "JP Morgan Cross-Market Research",
            sector: "Cross-Sector",
            market: "GLOBAL",
            date: "2026-02-22",
            documentType: "analysis",
        },
        {
            id: "doc-010",
            title: "Retail & E-Commerce: Amazon's AI Moat Widens",
            content: `Retail & E-Commerce (AVS: 76/100) is undergoing AI-driven consolidation where technology leaders are pulling away from traditional retailers at an accelerating pace.

Amazon's AI Advantage Stack:
1. Supply Chain Intelligence: AI-powered demand forecasting reduces inventory costs by 18% and stockouts by 32%. Amazon's anticipatory shipping model — pre-positioning goods before orders are placed — achieves 94% accuracy for top-selling items.
2. Personalization Engine: AI-driven product recommendations generate 35% of Amazon's revenue. The recommendation system processes 150 million customer interactions daily.
3. Warehouse Automation: 750,000 robots across fulfillment centers. Per-unit fulfillment cost is now $2.84 vs industry average of $4.12 — a 31% structural cost advantage.

Amazon Q4 results (revenue $178.3B, +3.62% beat) demonstrate the compounding effect: AI improvements in each layer multiply across the value chain. The 73 AI mentions in the earnings call signal continued investment acceleration.

Traditional Retail Displacement:
Brick-and-mortar retailers without AI capabilities are losing market share at 2-3% per year. Walmart's AI investment ($1.8B in 2025) is keeping it competitive, but mid-tier retailers (Macy's, Kohl's, JCPenney) face existential risk.

Indian E-Commerce Parallel:
Reliance Retail and Flipkart are deploying similar AI stacks but face unique challenges: India's fragmented logistics network and cash-on-delivery preferences create implementation frictions that don't exist in the US market. India's retail AI adoption lags the US by approximately 3 years.`,
            source: "Deutsche Bank Research",
            sector: "Retail & E-Commerce",
            market: "US",
            date: "2026-02-18",
            documentType: "report",
        },
        {
            id: "doc-011",
            title: "The AI Earnings Call Analysis: What CEOs Are and Aren't Saying",
            content: `Analysis of AI mentions across 200+ earnings calls from Q4 2025 reveals a clear pattern: the frequency and context of AI references strongly correlates with stock performance.

AI Mention Taxonomy:
We classified AI mentions into four categories:
1. Revenue AI (mentions tied to AI-driven revenue growth): Strongest positive correlation with post-earnings price movement (+4.2% average)
2. Efficiency AI (mentions tied to cost reduction through AI): Moderate positive correlation (+1.8% average)
3. Defensive AI (mentions acknowledging AI threats and mitigation strategies): Slight negative correlation (-0.5% average) — markets punish companies that frame AI as a threat
4. Aspirational AI (vague future AI plans without concrete metrics): No correlation — markets ignore AI buzzwords without substance

Top AI Mention Companies by Category:
- Revenue AI: NVIDIA (147 mentions, 78% Revenue AI) — $35.1B revenue, +8.2% post-earnings
- Revenue AI: Meta (112 mentions, 65% Revenue AI) — $46.7B revenue, +5.2% post-earnings  
- Efficiency AI: JPMorgan (42 mentions, 71% Efficiency AI) — $44.2B revenue, +2.1% post-earnings
- Defensive AI: TCS (67 mentions, 52% Defensive AI) — ₹64.3K Cr revenue, -2.3% post-earnings
- Aspirational AI: FedEx (56 mentions, 64% Aspirational AI) — $22.1B revenue, -9.1% post-earnings

The "AI Conviction Gap": Companies whose AI mentions are >50% Revenue or Efficiency AI outperform the S&P 500 by 6.3% in the following quarter. Companies whose mentions are >50% Defensive or Aspirational underperform by 3.1%. This metric is now a standard input to our quantitative models.

Implication for Portfolio Construction: Weight AI mention quality, not quantity, when assessing company AI positioning. FedEx mentions AI more than JPMorgan but in vastly less credible contexts.`,
            source: "MarketMind Research",
            sector: "Cross-Sector",
            market: "GLOBAL",
            date: "2026-03-01",
            documentType: "whitepaper",
        },
        {
            id: "doc-012",
            title: "Energy Sector: AI's Unexpected Beneficiary",
            content: `Energy & Utilities (AVS: 28/100) is one of the least vulnerable sectors to AI disruption, but is emerging as a major indirect beneficiary of the AI revolution through datacenter power demand.

The AI Power Paradox:
Global AI infrastructure power consumption is projected to reach 150 TWh by 2027 — equivalent to the entire electricity consumption of Argentina. This creates massive demand for:
1. Natural gas power generation (fastest path to new capacity)
2. Nuclear power (long-term baseload for AI datacenters — Microsoft's Three Mile Island restart, Amazon's Talen Energy deal)
3. Renewable capacity (hyperscalers' net-zero commitments require clean energy procurement)

Market Impact:
The energy sector's 2.1% positive performance and LOW automation risk classification reflect this dual advantage: minimal AI threat to existing operations + massive new demand from AI infrastructure. Crude oil at $72.84 (-1.25%) reflects the longer-term transition narrative, but natural gas and nuclear plays are outperforming.

Why AVS is Low:
Energy infrastructure is inherently physical — you cannot automate a power plant into software. AI applications in energy (predictive maintenance, grid optimization, drilling optimization) augment rather than replace human operations, and the sector's physical asset base provides a natural moat against digital disruption.

Investment thesis: Energy is the "picks and shovels" play for the AI revolution. Long nuclear (Constellation Energy, Cameco), natural gas infrastructure (Williams Companies, Kinder Morgan), and utility-scale solar/storage (NextEra Energy) as AI datacenter demand accelerates.`,
            source: "Raymond James Research",
            sector: "Energy & Utilities",
            market: "US",
            date: "2026-02-25",
            documentType: "analysis",
        },
        {
            id: "doc-013",
            title: "Biotech & Pharma: AI Accelerates Drug Discovery Without Disrupting Revenue",
            content: `Biotech & Pharma (AVS: 22/100) has the second-lowest vulnerability score, reflecting a sector where AI acts as a powerful accelerant rather than a disruptor of existing business models.

AI in Drug Discovery — The Value Creation Story:
1. Target Identification: AI reduces target validation time from 4-5 years to 1-2 years. Recursion Pharmaceuticals' AI platform has identified 3 novel drug targets that reached Phase II trials in under 2 years.
2. Molecular Design: Generative chemistry AI designs novel molecules 100x faster than traditional medicinal chemistry. Insilico Medicine's AI-designed drug (INS018_055) entered Phase II for IPF in record time.
3. Clinical Trial Optimization: AI patient stratification reduces trial failure rates by 30% and speeds enrollment by 40%.

The FDA's approval of an AI-assisted drug discovery platform (partnering with Moderna) signals regulatory acceptance of AI in the drug development process. This is bullish for the sector — AI reduces R&D costs (currently $2.6B average per approved drug) without threatening existing revenue streams.

Why pharma has a natural moat against AI disruption:
- Patent protection creates 10-20 year revenue visibility
- FDA approval process requires physical clinical trials that AI cannot skip
- Manufacturing of biologics requires physical infrastructure
- Doctor-patient relationships in prescribing cannot be fully automated

The 3.4% positive sector performance reflects investor enthusiasm for AI as a drug development accelerant. Indian pharma (Nifty Pharma +4.1%) benefits additionally from India's role as the "pharmacy of the world" — AI-optimized manufacturing processes in Indian generics facilities are reducing costs while improving quality compliance.`,
            source: "Leerink Partners Research",
            sector: "Biotech & Pharma",
            market: "GLOBAL",
            date: "2026-02-14",
            documentType: "report",
        },
        {
            id: "doc-014",
            title: "Manufacturing & The Physical Intelligence Gap",
            content: `Manufacturing (AVS: 55/100) sits at the mid-point of the disruption spectrum, reflecting a sector partially protected by physical-world complexity but increasingly exposed to AI-driven efficiency mandates.

Tesla as Case Study:
Tesla's Q4 miss (revenue $26.3B vs $27.1B estimate, EPS miss of -8.97%) reveals the tension between AI ambition and manufacturing reality. Despite 89 AI mentions in the earnings call (second highest after NVIDIA), Tesla's manufacturing challenges — production ramp issues with Cybertruck, quality control problems in new factories — demonstrate that AI cannot yet solve physical manufacturing complexities.

The -6.4% post-earnings price drop reflects a market that is differentiating between software AI (high value, proven) and physical AI (high value, unproven). Tesla's Full Self-Driving ambitions are software AI applied to a physical domain — the uncertainty premium is appropriately high.

Manufacturing AI Applications by Maturity:
1. Mature (deployed at scale): Predictive maintenance, quality inspection, supply chain optimization
2. Emerging (pilot stage): Robotic assembly with AI vision, generative design for parts optimization
3. Speculative (R&D): Fully autonomous factories, AI-driven materials discovery

Indian Manufacturing (Auto & Manufacturing sector, AVS: 58/100):
Reliance Industries' Q4 results (revenue ₹246.8K Cr, +3.56% beat) show the conglomerate leveraging AI across manufacturing, telecom, and retail. India's manufacturing AI adoption is accelerating faster than other sectors due to government "Make in India" initiatives that explicitly include AI-powered manufacturing subsidies.

The key risk: Manufacturing AI requires massive upfront capital expenditure ($50-200M for a single factory retrofit). This creates a winner-take-all dynamic where well-capitalized manufacturers (Tesla, Reliance, Toyota) pull ahead while smaller manufacturers cannot afford the AI transition.`,
            source: "BCG Industrial Research",
            sector: "Manufacturing",
            market: "GLOBAL",
            date: "2026-02-19",
            documentType: "analysis",
        },
        {
            id: "doc-015",
            title: "The AI Market Regime: Bull and Bear Scenarios for 2026-2028",
            content: `Three macro scenarios for AI's market impact over the next 24 months:

BULL CASE (30% probability):
AI productivity gains accelerate faster than job displacement. S&P 500 earnings grow 18-22% annually as companies deploy AI to expand margins. NVIDIA revenue exceeds $200B by 2028. Indian IT Services successfully pivot to AI-first delivery, maintaining margins while reducing headcount. NIFTY 50 reaches 28,000.
Key catalyst: AGI breakthrough or transformative autonomous systems achieve commercial scale.

BASE CASE (50% probability):
Gradual AI adoption with sector-specific disruption. High-AVS sectors (Transportation, Financial Services, Retail) experience 10-15% workforce reductions over 3 years. Low-AVS sectors benefit from AI augmentation without job losses. S&P 500 grows 10-14% annually. Indian IT bifurcation: top-tier companies (TCS, Infosys, HCL) stabilize while tier-2 companies face margin pressure. NIFTY 50 reaches 25,000.
Key dynamic: AI capex continues but ROI expectations normalize, creating a "productive disillusionment" phase similar to cloud computing 2015-2018.

BEAR CASE (20% probability):
AI bubble deflates as enterprise ROI disappoints. Revenue concentration risk materializes — NVIDIA loses 15-20% market share to custom ASICs (Google TPU, Amazon Trainium). Tech sector correction of 25-30%. Indian IT services face severe margin compression as AI both reduces demand for services AND allows US companies to reshore jobs. NIFTY IT declines 20-25%.
Key trigger: Major AI safety incident, regulatory crackdown, or proof that current LLMs have hit fundamental capability ceilings.

Portfolio Positioning:
For each scenario, we recommend maintaining 40% AI beneficiary exposure (NVIDIA, META, cloud infrastructure), 30% AI-resilient exposure (defense, energy, pharma), and 30% cash/bonds as dry powder for scenario shifts. Overweight India banking as a high-conviction cross-scenario play.`,
            source: "MarketMind Strategy Research",
            sector: "Cross-Sector",
            market: "GLOBAL",
            date: "2026-03-01",
            documentType: "whitepaper",
        },
    ];
}

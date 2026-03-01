import { createSchema, createYoga } from "graphql-yoga";
import {
    getSectorData,
    getEarningsReports,
    getMarketIndices,
    getMarketNews,
    getMarketSummary,
    type SectorData,
    type EarningsReport,
} from "@/lib/market-data";

const typeDefs = /* GraphQL */ `
  enum AutomationRisk {
    LOW
    MODERATE
    HIGH
    CRITICAL
  }

  enum Sentiment {
    BULLISH
    BEARISH
    NEUTRAL
  }

  enum Impact {
    HIGH
    MEDIUM
    LOW
  }

  enum Market {
    US
    IN
  }

  type Sector {
    name: String!
    ticker: String!
    market: Market!
    aiVulnerability: Int!
    performance: Float!
    marketCap: String!
    automationRisk: AutomationRisk!
  }

  type FinancialMetrics {
    company: String!
    ticker: String!
    sector: String!
    market: Market!
    revenue: Float!
    revenueEstimate: Float!
    eps: Float!
    epsEstimate: Float!
    beat: Boolean!
    surprise: Float!
    aiMentions: Int!
    priceChange: Float!
    date: String!
  }

  type MarketIndex {
    name: String!
    ticker: String!
    market: Market!
    value: Float!
    change: Float!
    changePercent: Float!
  }

  type MarketNews {
    id: ID!
    headline: String!
    source: String!
    sector: String!
    sentiment: Sentiment!
    timestamp: String!
    impact: Impact!
  }

  type Query {
    sectors(market: Market): [Sector!]!
    sector(ticker: String!): Sector
    earnings(ticker: String, sector: String, market: Market, limit: Int): [FinancialMetrics!]!
    indices(market: Market): [MarketIndex!]!
    news(sector: String, sentiment: Sentiment, limit: Int): [MarketNews!]!
    marketSummary: String!
  }
`;

const resolvers = {
    Query: {
        sectors: (_: unknown, args: { market?: string }) => {
            const sectors = getSectorData();
            if (args.market) {
                return sectors.filter((s: SectorData) => s.market === args.market);
            }
            return sectors;
        },

        sector: (_: unknown, args: { ticker: string }) => {
            return getSectorData().find((s: SectorData) => s.ticker === args.ticker) || null;
        },

        earnings: (
            _: unknown,
            args: { ticker?: string; sector?: string; market?: string; limit?: number }
        ) => {
            let earnings = getEarningsReports();
            if (args.ticker) {
                earnings = earnings.filter((e: EarningsReport) => e.ticker === args.ticker);
            }
            if (args.sector) {
                earnings = earnings.filter((e: EarningsReport) => e.sector === args.sector);
            }
            if (args.market) {
                earnings = earnings.filter((e: EarningsReport) => e.market === args.market);
            }
            if (args.limit) {
                earnings = earnings.slice(0, args.limit);
            }
            return earnings;
        },

        indices: (_: unknown, args: { market?: string }) => {
            const indices = getMarketIndices();
            if (args.market) {
                return indices.filter(
                    (i: { market: string }) => i.market === args.market
                );
            }
            return indices;
        },

        news: (
            _: unknown,
            args: { sector?: string; sentiment?: string; limit?: number }
        ) => {
            let news = getMarketNews();
            if (args.sector) {
                news = news.filter((n) => n.sector === args.sector);
            }
            if (args.sentiment) {
                news = news.filter((n) => n.sentiment === args.sentiment);
            }
            if (args.limit) {
                news = news.slice(0, args.limit);
            }
            return news;
        },

        marketSummary: () => getMarketSummary(),
    },
};

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
    schema,
    graphqlEndpoint: "/api/graphql",
    fetchAPI: { Response },
});

// Wrap Yoga handlers to match Next.js route handler signatures
export async function GET(request: Request) {
    return yoga.handleRequest(request, {});
}

export async function POST(request: Request) {
    return yoga.handleRequest(request, {});
}

import { gql } from "@urql/core";

export const GET_SECTORS = gql`
  query GetSectors($market: Market) {
    sectors(market: $market) {
      name
      ticker
      market
      aiVulnerability
      performance
      marketCap
      automationRisk
    }
  }
`;

export const GET_SECTOR = gql`
  query GetSector($ticker: String!) {
    sector(ticker: $ticker) {
      name
      ticker
      market
      aiVulnerability
      performance
      marketCap
      automationRisk
    }
  }
`;

export const GET_EARNINGS = gql`
  query GetEarnings($ticker: String, $sector: String, $market: Market, $limit: Int) {
    earnings(ticker: $ticker, sector: $sector, market: $market, limit: $limit) {
      company
      ticker
      sector
      market
      revenue
      revenueEstimate
      eps
      epsEstimate
      beat
      surprise
      aiMentions
      priceChange
      date
    }
  }
`;

export const GET_INDICES = gql`
  query GetIndices($market: Market) {
    indices(market: $market) {
      name
      ticker
      market
      value
      change
      changePercent
    }
  }
`;

export const GET_NEWS = gql`
  query GetNews($sector: String, $sentiment: Sentiment, $limit: Int) {
    news(sector: $sector, sentiment: $sentiment, limit: $limit) {
      id
      headline
      source
      sector
      sentiment
      timestamp
      impact
    }
  }
`;

export const GET_MARKET_SUMMARY = gql`
  query GetMarketSummary {
    marketSummary
  }
`;

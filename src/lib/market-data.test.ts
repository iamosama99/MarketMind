import { describe, it, expect } from "vitest";
import {
  getSectorData,
  getEarningsReports,
  getMarketIndices,
  getMarketNews,
  getMarketSummary,
} from "./market-data";

describe("getSectorData()", () => {
  const sectors = getSectorData();

  it("returns a non-empty array", () => {
    expect(sectors.length).toBeGreaterThan(0);
  });

  it("every sector has required fields with correct types", () => {
    for (const s of sectors) {
      expect(s).toMatchObject({
        name: expect.any(String),
        ticker: expect.any(String),
        market: expect.stringMatching(/^(US|IN)$/),
        aiVulnerability: expect.any(Number),
        performance: expect.any(Number),
        marketCap: expect.any(String),
        automationRisk: expect.stringMatching(/^(LOW|MODERATE|HIGH|CRITICAL)$/),
      });
    }
  });

  it("aiVulnerability is within 0-100 range", () => {
    for (const s of sectors) {
      expect(s.aiVulnerability).toBeGreaterThanOrEqual(0);
      expect(s.aiVulnerability).toBeLessThanOrEqual(100);
    }
  });
});

describe("getEarningsReports()", () => {
  const earnings = getEarningsReports();

  it("returns a non-empty array", () => {
    expect(earnings.length).toBeGreaterThan(0);
  });

  it("every report has required fields", () => {
    for (const e of earnings) {
      expect(typeof e.company).toBe("string");
      expect(typeof e.ticker).toBe("string");
      expect(["US", "IN"]).toContain(e.market);
      expect(typeof e.beat).toBe("boolean");
      expect(typeof e.eps).toBe("number");
      expect(typeof e.epsEstimate).toBe("number");
    }
  });

  it("beat flag is consistent with eps vs epsEstimate", () => {
    for (const e of earnings) {
      if (e.beat) {
        expect(e.eps).toBeGreaterThanOrEqual(e.epsEstimate);
      } else {
        expect(e.eps).toBeLessThan(e.epsEstimate);
      }
    }
  });

  it("contains both US and IN market reports", () => {
    const markets = new Set(earnings.map((e) => e.market));
    expect(markets.has("US")).toBe(true);
    expect(markets.has("IN")).toBe(true);
  });
});

describe("getMarketIndices()", () => {
  const indices = getMarketIndices();

  it("returns a non-empty array", () => {
    expect(indices.length).toBeGreaterThan(0);
  });

  it("every index has required numeric fields", () => {
    for (const i of indices) {
      expect(typeof i.name).toBe("string");
      expect(typeof i.ticker).toBe("string");
      expect(typeof i.value).toBe("number");
      expect(typeof i.change).toBe("number");
      expect(typeof i.changePercent).toBe("number");
    }
  });

  it("contains both US and IN indices", () => {
    const markets = new Set(indices.map((i) => i.market));
    expect(markets.has("US")).toBe(true);
    expect(markets.has("IN")).toBe(true);
  });
});

describe("getMarketNews()", () => {
  const news = getMarketNews();

  it("returns a non-empty array", () => {
    expect(news.length).toBeGreaterThan(0);
  });

  it("every news item has valid sentiment and impact", () => {
    for (const n of news) {
      expect(["BULLISH", "BEARISH", "NEUTRAL"]).toContain(n.sentiment);
      expect(["HIGH", "MEDIUM", "LOW"]).toContain(n.impact);
    }
  });

  it("every news item has a unique id", () => {
    const ids = news.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getMarketSummary()", () => {
  it("returns a string containing key sections", () => {
    const summary = getMarketSummary();
    expect(summary.length).toBeGreaterThan(100);
    expect(summary).toContain("US INDICES");
    expect(summary).toContain("INDIAN INDICES");
    expect(summary).toContain("SECTOR AI VULNERABILITY");
    expect(summary).toContain("RECENT EARNINGS");
    expect(summary).toContain("LATEST NEWS");
  });
});

import { describe, it, expect } from "vitest";
import {
  showSectorAnalysisInput,
  showEarningsReportInput,
  showMarketOverviewInput,
  showMetricInput,
  showNewsInput,
  showResearchSourcesInput,
} from "./schemas";

describe("showSectorAnalysisInput", () => {
  it("accepts empty object (all optional)", () => {
    expect(showSectorAnalysisInput.parse({})).toEqual({});
  });

  it("accepts valid market and limit", () => {
    const result = showSectorAnalysisInput.parse({ market: "US", limit: 5 });
    expect(result.market).toBe("US");
    expect(result.limit).toBe(5);
  });

  it("rejects invalid market value", () => {
    expect(() => showSectorAnalysisInput.parse({ market: "JP" })).toThrow();
  });
});

describe("showEarningsReportInput", () => {
  it("accepts empty object", () => {
    expect(showEarningsReportInput.parse({})).toEqual({});
  });

  it("accepts ticker + market filter", () => {
    const result = showEarningsReportInput.parse({ ticker: "NVDA", market: "US" });
    expect(result.ticker).toBe("NVDA");
    expect(result.market).toBe("US");
  });
});

describe("showMarketOverviewInput", () => {
  it("accepts empty object", () => {
    expect(showMarketOverviewInput.parse({})).toEqual({});
  });

  it("accepts IN market", () => {
    const result = showMarketOverviewInput.parse({ market: "IN" });
    expect(result.market).toBe("IN");
  });

  it("rejects invalid market", () => {
    expect(() => showMarketOverviewInput.parse({ market: "EU" })).toThrow();
  });
});

describe("showMetricInput", () => {
  it("requires all four fields", () => {
    expect(() => showMetricInput.parse({})).toThrow();
  });

  it("accepts valid full input", () => {
    const input = {
      label: "NVDA Revenue",
      value: "$35.1B",
      change: 5.95,
      description: "Record Q4 revenue",
    };
    expect(showMetricInput.parse(input)).toEqual(input);
  });

  it("rejects missing label", () => {
    expect(() =>
      showMetricInput.parse({ value: "$1B", change: 1, description: "x" })
    ).toThrow();
  });

  it("rejects wrong type for change", () => {
    expect(() =>
      showMetricInput.parse({
        label: "X",
        value: "Y",
        change: "not-a-number",
        description: "Z",
      })
    ).toThrow();
  });
});

describe("showNewsInput", () => {
  it("accepts empty object", () => {
    expect(showNewsInput.parse({})).toEqual({});
  });

  it("accepts sentiment filter", () => {
    const result = showNewsInput.parse({ sentiment: "BULLISH" });
    expect(result.sentiment).toBe("BULLISH");
  });

  it("rejects invalid sentiment", () => {
    expect(() => showNewsInput.parse({ sentiment: "POSITIVE" })).toThrow();
  });
});

describe("showResearchSourcesInput", () => {
  it("requires query field", () => {
    expect(() => showResearchSourcesInput.parse({})).toThrow();
  });

  it("accepts query with optional fields", () => {
    const result = showResearchSourcesInput.parse({
      query: "AI disruption in banking",
      sector: "Financial Services",
      limit: 3,
    });
    expect(result.query).toBe("AI disruption in banking");
    expect(result.sector).toBe("Financial Services");
    expect(result.limit).toBe(3);
  });
});

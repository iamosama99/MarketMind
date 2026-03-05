import { describe, it, expect } from "vitest";
import {
  queryMatchesAny,
  detectMarketFilter,
  detectTicker,
  detectSector,
} from "./quantitative";

describe("queryMatchesAny()", () => {
  it("returns true when query contains a keyword", () => {
    expect(queryMatchesAny("Show me sector data", ["sector", "heatmap"])).toBe(true);
  });

  it("returns false when no keyword matches", () => {
    expect(queryMatchesAny("hello world", ["sector", "earnings"])).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(queryMatchesAny("SECTOR analysis", ["sector"])).toBe(true);
  });
});

describe("detectMarketFilter()", () => {
  it("detects Indian market from 'nifty'", () => {
    expect(detectMarketFilter("How is Nifty today?")).toBe("IN");
  });

  it("detects Indian market from 'sensex'", () => {
    expect(detectMarketFilter("Show me SENSEX")).toBe("IN");
  });

  it("detects US market from 'nasdaq'", () => {
    expect(detectMarketFilter("Show me NASDAQ")).toBe("US");
  });

  it("detects US market from 's&p'", () => {
    expect(detectMarketFilter("How is S&P 500?")).toBe("US");
  });

  it("returns null for ambiguous queries", () => {
    expect(detectMarketFilter("Show me all sectors")).toBeNull();
  });
});

describe("detectTicker()", () => {
  it("detects NVDA from 'nvidia'", () => {
    expect(detectTicker("How did NVIDIA perform?")).toBe("NVDA");
  });

  it("detects Indian tickers from 'tcs'", () => {
    expect(detectTicker("Show TCS earnings")).toBe("TCS.NS");
  });

  it("detects infosys ticker", () => {
    expect(detectTicker("Infosys quarterly results")).toBe("INFY.NS");
  });

  it("returns null for unknown companies", () => {
    expect(detectTicker("What about the weather?")).toBeNull();
  });
});

describe("detectSector()", () => {
  it("detects technology sector", () => {
    expect(detectSector("tech sector analysis")).toBe("tech");
  });

  it("detects banking sector", () => {
    expect(detectSector("How is banking doing?")).toBe("banking");
  });

  it("detects healthcare sector", () => {
    expect(detectSector("healthcare outlook")).toBe("healthcare");
  });

  it("returns null when no sector matches", () => {
    expect(detectSector("hello world")).toBeNull();
  });
});

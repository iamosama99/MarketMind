import { describe, it, expect } from "vitest";
import { formatMarketCap } from "./market-data-live";

describe("formatMarketCap()", () => {
  describe("US market", () => {
    it("formats trillions", () => {
      expect(formatMarketCap(2.5e12, "US")).toBe("$2.5T");
    });

    it("formats billions", () => {
      expect(formatMarketCap(350e9, "US")).toBe("$350.0B");
    });

    it("formats millions", () => {
      expect(formatMarketCap(850e6, "US")).toBe("$850M");
    });
  });

  describe("IN market", () => {
    it("formats in Lakh Crore (INR)", () => {
      // 1e12 USD * 83 = 83e12 INR = 83 Lakh Crore
      expect(formatMarketCap(1e12, "IN")).toBe("₹83.0L Cr");
    });

    it("formats smaller values", () => {
      // 1e9 USD * 83 = 83e9 INR = 0.083 Lakh Crore
      expect(formatMarketCap(1e9, "IN")).toBe("₹0.1L Cr");
    });
  });

  describe("edge cases", () => {
    it("returns null for undefined input", () => {
      expect(formatMarketCap(undefined, "US")).toBeNull();
    });

    it("returns null for zero", () => {
      expect(formatMarketCap(0, "US")).toBeNull();
    });
  });
});

import { describe, it, expect } from "vitest";
import { getResearchDocuments } from "./knowledge-base";

describe("getResearchDocuments()", () => {
  const docs = getResearchDocuments();

  it("returns a non-empty array", () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  it("every document has required fields with correct types", () => {
    for (const doc of docs) {
      expect(typeof doc.id).toBe("string");
      expect(typeof doc.title).toBe("string");
      expect(doc.content.length).toBeGreaterThan(0);
      expect(typeof doc.source).toBe("string");
      expect(["US", "IN", "GLOBAL"]).toContain(doc.market);
      expect(["report", "analysis", "whitepaper", "note"]).toContain(doc.documentType);
    }
  });

  it("every document has a unique id", () => {
    const ids = docs.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every document has a non-empty sector", () => {
    for (const doc of docs) {
      expect(doc.sector.length).toBeGreaterThan(0);
    }
  });
});

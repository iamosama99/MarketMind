import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cache, TTL } from "./cache";

describe("TTLCache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    cache.invalidate("test-key");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for a key that was never set", () => {
    expect(cache.get("nonexistent")).toBeNull();
  });

  it("stores and retrieves a value within TTL", () => {
    cache.set("test-key", { price: 42 }, 5000);
    expect(cache.get("test-key")).toEqual({ price: 42 });
  });

  it("returns null after TTL expires", () => {
    cache.set("test-key", "hello", 1000);
    vi.advanceTimersByTime(1001);
    expect(cache.get("test-key")).toBeNull();
  });

  it("returns value just before TTL expires", () => {
    cache.set("test-key", "hello", 1000);
    vi.advanceTimersByTime(999);
    expect(cache.get("test-key")).toBe("hello");
  });

  it("invalidate() removes the key immediately", () => {
    cache.set("test-key", "data", 60_000);
    cache.invalidate("test-key");
    expect(cache.get("test-key")).toBeNull();
  });

  it("invalidate() is safe on nonexistent keys", () => {
    expect(() => cache.invalidate("nope")).not.toThrow();
  });

  it("overwrites existing key with new value and TTL", () => {
    cache.set("test-key", "v1", 1000);
    cache.set("test-key", "v2", 5000);
    vi.advanceTimersByTime(2000);
    expect(cache.get("test-key")).toBe("v2");
  });

  it("preserves type information via generics", () => {
    cache.set("test-key", [1, 2, 3], 5000);
    const result = cache.get<number[]>("test-key");
    expect(result).toEqual([1, 2, 3]);
  });

  it("handles multiple independent keys", () => {
    cache.set("a", "alpha", 5000);
    cache.set("b", "beta", 1000);
    vi.advanceTimersByTime(1500);
    expect(cache.get("a")).toBe("alpha");
    expect(cache.get("b")).toBeNull();
    cache.invalidate("a");
  });
});

describe("TTL constants", () => {
  it("has expected values in milliseconds", () => {
    expect(TTL.INDICES).toBe(30_000);
    expect(TTL.SECTORS).toBe(300_000);
    expect(TTL.EARNINGS).toBe(3_600_000);
    expect(TTL.NEWS).toBe(900_000);
  });
});

// ============================================
// MarketMind — In-Memory TTL Cache
// Module-level singleton, zero dependencies
// Same pattern as vector-store.ts singleton
// ============================================

interface CacheEntry<T> {
    data: T;
    expiresAt: number; // epoch ms
}

class TTLCache {
    private store = new Map<string, CacheEntry<unknown>>();

    set<T>(key: string, data: T, ttlMs: number): void {
        this.store.set(key, {
            data,
            expiresAt: Date.now() + ttlMs,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.data as T;
    }

    invalidate(key: string): void {
        this.store.delete(key);
    }
}

// Module-level singleton — persists across requests within the Node process
export const cache = new TTLCache();

// TTL constants in milliseconds
export const TTL = {
    INDICES:  30_000,       // 30 seconds — near real-time prices
    SECTORS:  5 * 60_000,   // 5 minutes
    EARNINGS: 60 * 60_000,  // 1 hour
    NEWS:     15 * 60_000,  // 15 minutes
} as const;

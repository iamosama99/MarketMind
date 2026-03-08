// ============================================
// MarketMind — Agent Timeout Utility
// Per-agent latency budget enforcement
// ============================================

/**
 * Race a promise against a timeout. Returns `fallback` if the promise
 * doesn't resolve within `ms` milliseconds.
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    ms: number,
    fallback: T
): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;

    const timeout = new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
    });

    try {
        return await Promise.race([promise, timeout]);
    } finally {
        clearTimeout(timer!);
    }
}

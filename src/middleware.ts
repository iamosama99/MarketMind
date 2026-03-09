import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const config = {
    matcher: ["/api/chat", "/api/graphql"],
};

// Lazy-initialize so dev environments work without Upstash credentials
let ratelimiter: Ratelimit | null = null;
let initialized = false;

function getRatelimiter(): Ratelimit | null {
    if (initialized) return ratelimiter;
    initialized = true;

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }

    ratelimiter = new Ratelimit({
        redis: new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(10, "60 s"),
        analytics: true,
        prefix: "marketmind:ratelimit",
    });

    return ratelimiter;
}

export async function middleware(request: NextRequest) {
    const limiter = getRatelimiter();

    // No Upstash configured — pass through (local dev)
    if (!limiter) {
        return NextResponse.next();
    }

    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "anonymous";

    const { success, limit, reset, remaining } = await limiter.limit(ip);

    if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return new NextResponse(
            JSON.stringify({
                error: "Too many requests. Please try again later.",
                retryAfter,
            }),
            {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString(),
                    "Retry-After": retryAfter.toString(),
                },
            }
        );
    }

    return NextResponse.next();
}

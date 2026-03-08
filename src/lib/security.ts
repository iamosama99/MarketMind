// ============================================
// MarketMind — Security Utilities
// Input sanitization, canary tokens, output filtering
// ============================================

import { randomBytes } from "crypto";

// ── Input Sanitization ──

const MAX_QUERY_LENGTH = 2000;

// Control characters and zero-width chars to strip
const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const ZERO_WIDTH_RE = /[\u200B-\u200F\u2028-\u202F\u2060\uFEFF]/g;
const EXCESSIVE_WHITESPACE_RE = /\s{3,}/g;

/**
 * Sanitize user query input before passing to LLM agents.
 * Truncates, strips control/zero-width chars, collapses whitespace.
 */
export function sanitizeQuery(input: string): string {
    let sanitized = input
        .replace(CONTROL_CHAR_RE, "")
        .replace(ZERO_WIDTH_RE, "")
        .replace(EXCESSIVE_WHITESPACE_RE, "  ")
        .trim();

    if (sanitized.length > MAX_QUERY_LENGTH) {
        sanitized = sanitized.slice(0, MAX_QUERY_LENGTH);
    }

    return sanitized;
}

// ── Canary Token ──

/**
 * Generate a random canary token for prompt leakage detection.
 * If this token appears in LLM output, a system prompt leak occurred.
 */
export function generateCanaryToken(): string {
    return randomBytes(4).toString("hex"); // 8-char hex string
}

// ── Agent Output Sanitization ──

// Patterns that suggest prompt injection in agent outputs
const INJECTION_PATTERNS = [
    /<system>/gi,
    /<\/system>/gi,
    /<instructions>/gi,
    /<\/instructions>/gi,
    /ignore\s+(all\s+)?previous\s+instructions/gi,
    /ignore\s+(all\s+)?above\s+instructions/gi,
    /you\s+are\s+now\s+/gi,
    /new\s+instructions:/gi,
    /system\s*prompt:/gi,
    /override\s+instructions/gi,
    /disregard\s+(all\s+)?prior/gi,
    /forget\s+(all\s+)?previous/gi,
];

/**
 * Sanitize agent-generated text before injecting into synthesis prompt.
 * Strips patterns that look like prompt injection attempts from
 * qualitative agent narrative/crossMarketInsight fields.
 */
export function sanitizeAgentOutput(text: string): string {
    let sanitized = text;
    for (const pattern of INJECTION_PATTERNS) {
        sanitized = sanitized.replace(pattern, "[filtered]");
    }
    return sanitized;
}

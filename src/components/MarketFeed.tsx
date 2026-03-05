"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { COMPONENT_REGISTRY, TOOL_LABELS } from "@/lib/component-registry";
import styles from "./MarketFeed.module.css";
import genStyles from "./generative/generative.module.css";

export default function MarketFeed() {
    const { messages, status } = useChat({ id: "market-feed" });

    const feedRef = useRef<HTMLDivElement>(null);
    const isStreaming = status === "streaming" || status === "submitted";

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [messages]);

    const assistantMessages = messages.filter((m) => m.role === "assistant");

    return (
        <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
            <div className="panel-header">
                <div className="panel-title">
                    <span className="live-dot" />
                    Market Intelligence Feed
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                    {isStreaming && (
                        <span className={styles.streaming}>STREAMING</span>
                    )}
                    <div className="badge badge-green">AI AGENT</div>
                </div>
            </div>
            <div className={styles.feed} ref={feedRef}>
                {assistantMessages.length === 0 && !isStreaming ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>◈</div>
                        <div className={styles.emptyTitle}>MarketMind Intelligence</div>
                        <div className={styles.emptyText}>
                            Submit a query below to activate the autonomous market analysis
                            agent. Try: &quot;Which sectors are most vulnerable to AI
                            automation?&quot;
                        </div>
                    </div>
                ) : (
                    assistantMessages.map((message, i) => (
                        <div key={message.id} className={styles.message} style={{ animationDelay: `${i * 50}ms` }}>
                            <div className={styles.messageHeader}>
                                <div className={styles.agentLabel}>
                                    <span className={styles.agentDot} />
                                    MARKETMIND AGENT
                                </div>
                                <span className={styles.timestamp}>
                                    {new Date().toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                    })}
                                </span>
                            </div>
                            <div className={styles.pipelineBadges}>
                                {["🧠 Supervisor", "📊 Quantitative", "📰 Qualitative", "🔍 Research", "✍️ Synthesis"].map((agent, idx, arr) => (
                                    <span key={agent}>
                                        <span className={styles.pipelineBadge}>{agent}</span>
                                        {idx < arr.length - 1 && <span className={styles.pipelineArrow}> → </span>}
                                    </span>
                                ))}
                            </div>
                            <div className={styles.messageBody}>
                                {message.parts.map((part, j) => {
                                    // ── Text parts → markdown renderer ──
                                    if (part.type === "text") {
                                        return (
                                            <div key={`text-${j}`}>
                                                {part.text.split("\n").map((line: string, k: number) => {
                                                    if (line.startsWith("**") && line.endsWith("**")) {
                                                        return (
                                                            <h4 key={k} className={styles.heading}>
                                                                {line.replace(/\*\*/g, "")}
                                                            </h4>
                                                        );
                                                    }
                                                    if (line.startsWith("- ") || line.startsWith("• ")) {
                                                        return (
                                                            <div key={k} className={styles.bulletItem}>
                                                                <span className={styles.bullet}>›</span>
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: line
                                                                            .slice(2)
                                                                            .replace(
                                                                                /\*\*(.*?)\*\*/g,
                                                                                '<strong class="' + styles.bold + '">$1</strong>'
                                                                            ),
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                    if (line.trim() === "") return <br key={k} />;
                                                    return (
                                                        <p
                                                            key={k}
                                                            className={styles.paragraph}
                                                            dangerouslySetInnerHTML={{
                                                                __html: line.replace(
                                                                    /\*\*(.*?)\*\*/g,
                                                                    '<strong class="' + styles.bold + '">$1</strong>'
                                                                ),
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        );
                                    }

                                    // ── Tool parts → generative UI components ──
                                    if (part.type.startsWith("tool-")) {
                                        const toolName = part.type.replace("tool-", "");
                                        const Component = COMPONENT_REGISTRY[toolName];

                                        if (!Component) {
                                            // Unknown tool — skip
                                            return null;
                                        }

                                        const toolPart = part as {
                                            type: string;
                                            toolCallId: string;
                                            state: string;
                                            output?: unknown;
                                        };

                                        // Loading state
                                        if (toolPart.state === "input-streaming" || toolPart.state === "input-available") {
                                            return (
                                                <div key={toolPart.toolCallId} className={genStyles.skeleton}>
                                                    <span className={genStyles.skeletonDot} />
                                                    {TOOL_LABELS[toolName] || "Processing…"}
                                                </div>
                                            );
                                        }

                                        // Error state
                                        if (toolPart.state === "output-error") {
                                            return (
                                                <div key={toolPart.toolCallId} style={{
                                                    padding: "var(--space-3)",
                                                    color: "var(--red)",
                                                    fontFamily: "var(--font-mono)",
                                                    fontSize: "var(--text-xs)",
                                                }}>
                                                    ⚠ Tool error: failed to load data
                                                </div>
                                            );
                                        }

                                        // Output available → render the component
                                        if (toolPart.state === "output-available" && toolPart.output) {
                                            return (
                                                <Component key={toolPart.toolCallId} data={toolPart.output} />
                                            );
                                        }

                                        return null;
                                    }

                                    return null;
                                })}
                                {isStreaming &&
                                    i === assistantMessages.length - 1 && (
                                        <span className="cursor-blink" />
                                    )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

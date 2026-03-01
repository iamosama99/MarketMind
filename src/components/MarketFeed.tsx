"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import styles from "./MarketFeed.module.css";

interface TextPart {
    type: "text";
    text: string;
}

function getTextFromParts(parts: unknown[]): string {
    return (parts as TextPart[])
        .filter((p) => p.type === "text" && p.text)
        .map((p) => p.text)
        .join("");
}

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
                    assistantMessages.map((message, i) => {
                        const text = getTextFromParts(message.parts);
                        return (
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
                                <div className={styles.messageBody}>
                                    {text.split("\n").map((line: string, j: number) => {
                                        if (line.startsWith("**") && line.endsWith("**")) {
                                            return (
                                                <h4 key={j} className={styles.heading}>
                                                    {line.replace(/\*\*/g, "")}
                                                </h4>
                                            );
                                        }
                                        if (line.startsWith("- ") || line.startsWith("• ")) {
                                            return (
                                                <div key={j} className={styles.bulletItem}>
                                                    <span className={styles.bullet}>›</span>
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: line
                                                                .slice(2)
                                                                .replace(
                                                                    /\*\*(.*?)\*\*/g,
                                                                    '<strong class="' +
                                                                    styles.bold +
                                                                    '">$1</strong>'
                                                                ),
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }
                                        if (line.trim() === "") return <br key={j} />;
                                        return (
                                            <p
                                                key={j}
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
                                    {isStreaming &&
                                        i === assistantMessages.length - 1 && (
                                            <span className="cursor-blink" />
                                        )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

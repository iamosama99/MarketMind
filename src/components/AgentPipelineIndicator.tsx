"use client";

import { useState, useEffect } from "react";
import styles from "./MarketFeed.module.css";

const AGENT_STEPS = [
    { key: "supervisor", label: "Supervisor", icon: "🧠" },
    { key: "quantitative", label: "Quantitative", icon: "📊" },
    { key: "qualitative", label: "Qualitative", icon: "📰" },
    { key: "research", label: "Research", icon: "🔍" },
    { key: "synthesis", label: "Synthesis", icon: "✍️" },
];

// Staggered delays simulating pipeline progression
const STEP_DELAYS = [0, 1500, 3000, 5000, 7000];

export default function AgentPipelineIndicator() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timers = STEP_DELAYS.map((delay, i) =>
            setTimeout(() => setActiveIndex(i), delay)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className={styles.pipelinePanel}>
            <div className={styles.pipelinePanelHeader}>AGENT PIPELINE ACTIVE</div>
            <div className={styles.pipelineSteps}>
                {AGENT_STEPS.map((step, i) => {
                    const isComplete = i < activeIndex;
                    const isActive = i === activeIndex;
                    const isWaiting = i > activeIndex;

                    return (
                        <div key={step.key} className={styles.pipelineStepRow}>
                            <span
                                className={`${styles.pipelineStepDot} ${
                                    isComplete
                                        ? styles.pipelineStepDotComplete
                                        : isActive
                                          ? styles.pipelineStepDotActive
                                          : styles.pipelineStepDotWaiting
                                }`}
                            />
                            <span
                                className={`${styles.pipelineStepLabel} ${
                                    isWaiting ? styles.pipelineStepLabelWaiting : ""
                                }`}
                            >
                                {step.icon} {step.label}
                            </span>
                            {isActive && (
                                <span className={styles.pipelineStepStatus}>processing</span>
                            )}
                            {isComplete && (
                                <span className={styles.pipelineStepDone}>done</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className={styles.shimmerContainer}>
                <div className={`${styles.shimmerLine} ${styles.shimmerLineLong}`} />
                <div className={`${styles.shimmerLine} ${styles.shimmerLineMedium}`} />
                <div className={`${styles.shimmerLine} ${styles.shimmerLineShort}`} />
            </div>
        </div>
    );
}

"use client";

import { useChatContext } from "@/lib/chat-context";
import { useApiKeyContext } from "@/lib/api-key-context";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import styles from "./CommandInput.module.css";

const SUGGESTIONS = [
    "Which sectors are most vulnerable to AI automation?",
    "Analyze NVDA earnings and AI infrastructure thesis",
    "Compare financial services vs. tech sector resilience",
    "What does the VIX spike signal for AI-heavy portfolios?",
    "Identify mispricings between vulnerability scores and performance",
];

export default function CommandInput() {
    const { sendMessage, status } = useChatContext();
    const { hasApiKey, setShowModal } = useApiKeyContext();
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const isStreaming = status === "streaming" || status === "submitted";
    const isDisabled = isStreaming || !hasApiKey;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim() || isDisabled) return;
        setShowSuggestions(false);
        sendMessage({ text: inputValue.trim() });
        setInputValue("");
    };

    const sendSuggestion = (text: string) => {
        setShowSuggestions(false);
        sendMessage({ text });
        setInputValue("");
    };

    return (
        <div className={styles.wrapper}>
            {showSuggestions && (
                <div className={styles.suggestions}>
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={i}
                            className={styles.suggestionItem}
                            onClick={() => sendSuggestion(s)}
                            type="button"
                        >
                            <span className={styles.suggestionIcon}>⚡</span>
                            {s}
                        </button>
                    ))}
                </div>
            )}
            <form
                id="command-form"
                onSubmit={onSubmit}
                className={styles.form}
            >
                <div className={styles.prompt}>
                    <span className={styles.promptChar}>❯</span>
                    <span className={styles.promptLabel}>MARKETMIND</span>
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => hasApiKey ? setShowSuggestions(true) : setShowModal(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={hasApiKey ? "Enter analysis query..." : "Set your OpenAI API key to start..."}
                    className={styles.input}
                    disabled={isDisabled}
                    autoComplete="off"
                    spellCheck={false}
                    id="command-input"
                />
                <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={!inputValue.trim() || isDisabled}
                    aria-label="Submit query"
                    id="command-submit"
                >
                    {isStreaming ? (
                        <div className={styles.spinner} />
                    ) : (
                        <Send size={14} />
                    )}
                </button>
            </form>
        </div>
    );
}

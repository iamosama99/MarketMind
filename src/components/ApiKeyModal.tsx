"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useApiKeyContext } from "@/lib/api-key-context";
import styles from "./ApiKeyModal.module.css";

function isValidKeyFormat(key: string): boolean {
    return key.startsWith("sk-") && key.length >= 20;
}

export default function ApiKeyModal() {
    const { setApiKey, clearApiKey, hasApiKey, showModal, setShowModal } = useApiKeyContext();
    const [inputValue, setInputValue] = useState("");
    const [showKey, setShowKey] = useState(false);

    if (!showModal) return null;

    const isValid = isValidKeyFormat(inputValue);
    const showValidation = inputValue.length > 0;

    const handleSave = () => {
        if (isValid) {
            setApiKey(inputValue);
            setInputValue("");
            setShowKey(false);
        }
    };

    const handleClear = () => {
        clearApiKey();
        setInputValue("");
        setShowKey(false);
    };

    const handleCancel = () => {
        if (hasApiKey) {
            setShowModal(false);
            setInputValue("");
            setShowKey(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.header}>
                    {hasApiKey ? "▸ UPDATE API KEY" : "▸ API KEY REQUIRED"}
                </div>

                <p className={styles.description}>
                    MarketMind requires an OpenAI API key to power the multi-agent pipeline.
                    Your key is stored <strong>only in your browser</strong> (localStorage) and sent
                    directly to OpenAI via HTTPS. It is never logged or stored on our servers.{" "}
                    <a
                        href="https://github.com/iamosama99/MarketMind"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        Verify in the source code →
                    </a>
                </p>

                <div className={styles.inputGroup}>
                    <input
                        type={showKey ? "text" : "password"}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        placeholder={hasApiKey ? "Enter new key to replace..." : "sk-..."}
                        className={styles.input}
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                    />
                    <div className={styles.inputActions}>
                        {showValidation && (
                            isValid
                                ? <span className={styles.validIcon}><Check size={14} /></span>
                                : <span className={styles.invalidIcon}><X size={14} /></span>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className={styles.toggleBtn}
                            aria-label={showKey ? "Hide key" : "Show key"}
                        >
                            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                </div>

                <div className={styles.buttons}>
                    <button
                        onClick={handleSave}
                        disabled={!isValid}
                        className={styles.saveBtn}
                    >
                        SAVE KEY
                    </button>
                    {hasApiKey && (
                        <>
                            <button onClick={handleCancel} className={styles.cancelBtn}>
                                CANCEL
                            </button>
                            <button onClick={handleClear} className={styles.clearBtn}>
                                CLEAR
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.helpRow}>
                    <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.helpLink}
                    >
                        Don&apos;t have a key? Get one at platform.openai.com →
                    </a>
                </div>
            </div>
        </div>
    );
}

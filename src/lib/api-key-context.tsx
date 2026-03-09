"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "mm_api_key";

interface ApiKeyContextValue {
    apiKey: string;
    setApiKey: (key: string) => void;
    clearApiKey: () => void;
    hasApiKey: boolean;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
    // Start with SSR-safe defaults to avoid hydration mismatch
    const [apiKey, setApiKeyState] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Sync from localStorage after mount (client only).
    // This is a deliberate mount-only sync for SSR-safe hydration.
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) || "";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApiKeyState(stored);
        if (!stored) setShowModal(true);
    }, []);

    const setApiKey = useCallback((key: string) => {
        setApiKeyState(key);
        localStorage.setItem(STORAGE_KEY, key);
        setShowModal(false);
    }, []);

    const clearApiKey = useCallback(() => {
        setApiKeyState("");
        localStorage.removeItem(STORAGE_KEY);
        setShowModal(true);
    }, []);

    return (
        <ApiKeyContext.Provider
            value={{
                apiKey,
                setApiKey,
                clearApiKey,
                hasApiKey: apiKey.length > 0,
                showModal,
                setShowModal,
            }}
        >
            {children}
        </ApiKeyContext.Provider>
    );
}

export function useApiKeyContext(): ApiKeyContextValue {
    const ctx = useContext(ApiKeyContext);
    if (!ctx) throw new Error("useApiKeyContext must be used inside ApiKeyProvider");
    return ctx;
}

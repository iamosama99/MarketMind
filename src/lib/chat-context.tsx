"use client";

// ============================================
// MarketMind — Shared Chat Context
// Lifts useChat to a single instance so
// CommandInput (sends) and MarketFeed (reads)
// share the same state. Required in
// @ai-sdk/react v3 which no longer shares
// state across useChat calls by id.
// ============================================

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useApiKeyContext } from "./api-key-context";

type ChatHook = ReturnType<typeof useChat>;

interface ChatContextValue {
    messages: UIMessage[];
    status: ChatHook["status"];
    sendMessage: ChatHook["sendMessage"];
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { apiKey } = useApiKeyContext();

    // Dynamic headers resolver — called on each request so it always
    // uses the latest API key without re-creating the transport.
    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: "/api/chat",
                headers: (): Record<string, string> => (apiKey ? { "X-Api-Key": apiKey } : {}),
            }),
        [apiKey]
    );

    const { messages, status, sendMessage } = useChat({
        id: "market-feed",
        transport,
    });

    return (
        <ChatContext.Provider value={{ messages: messages as UIMessage[], status, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext(): ChatContextValue {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
    return ctx;
}

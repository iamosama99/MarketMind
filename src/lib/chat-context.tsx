"use client";

// ============================================
// MarketMind — Shared Chat Context
// Lifts useChat to a single instance so
// CommandInput (sends) and MarketFeed (reads)
// share the same state. Required in
// @ai-sdk/react v3 which no longer shares
// state across useChat calls by id.
// ============================================

import { createContext, useContext, type ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

type ChatHook = ReturnType<typeof useChat>;

interface ChatContextValue {
    messages: UIMessage[];
    status: ChatHook["status"];
    sendMessage: ChatHook["sendMessage"];
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { messages, status, sendMessage } = useChat({
        id: "market-feed",
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

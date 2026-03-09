"use client";

import { Provider, createClient, cacheExchange, fetchExchange } from "urql";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiKeyProvider } from "@/lib/api-key-context";
import { ChatProvider } from "@/lib/chat-context";
import ApiKeyModal from "@/components/ApiKeyModal";

const client = createClient({
    url: "/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider value={client}>
            <TooltipProvider delayDuration={200}>
                <ApiKeyProvider>
                    <ChatProvider>
                        {children}
                        <ApiKeyModal />
                    </ChatProvider>
                </ApiKeyProvider>
            </TooltipProvider>
        </Provider>
    );
}

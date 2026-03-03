"use client";

import { Provider, createClient, cacheExchange, fetchExchange } from "urql";
import { TooltipProvider } from "@/components/ui/tooltip";

const client = createClient({
    url: "/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider value={client}>
            <TooltipProvider delayDuration={200}>
                {children}
            </TooltipProvider>
        </Provider>
    );
}

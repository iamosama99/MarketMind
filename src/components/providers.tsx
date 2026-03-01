"use client";

import { Provider, createClient, cacheExchange, fetchExchange } from "urql";

const client = createClient({
    url: "/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return <Provider value={client}>{children}</Provider>;
}

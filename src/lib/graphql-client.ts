import { cacheExchange, createClient, fetchExchange } from "@urql/core";

export const graphqlClient = createClient({
    url: "/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
});

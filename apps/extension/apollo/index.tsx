import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
	uri: process.env.PLASMO_PUBLIC_QTHEME_V2_ENDPOINT ?? "",
	cache: new InMemoryCache(),
});

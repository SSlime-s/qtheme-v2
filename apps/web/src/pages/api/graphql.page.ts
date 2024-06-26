import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { resolvers } from "@/apollo/resolvers";
import typeDefs from "@/apollo/schema.graphql";
import { extractShowcaseUser } from "@/utils/extractUser";
import { prisma } from "@repo/database";

import type { ContextValue } from "@/apollo/resolvers";
import type { NextApiHandler } from "next";

const server = new ApolloServer<ContextValue>({
	typeDefs,
	resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
	context: async (req, res) => {
		const userId = extractShowcaseUser(req);
		const revalidate = res.revalidate;

		return {
			userId,
			revalidate,
			prisma,
			req,
			res,
		};
	},
});

const res: NextApiHandler = async (req, res) => {
	if (process.env.NODE_ENV === "development") {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Content-Type, X-Forwarded-User",
		);

		if (req.method === "OPTIONS") {
			res.end();
			return false;
		}
	}

	await handler(req, res);
};
export default res;

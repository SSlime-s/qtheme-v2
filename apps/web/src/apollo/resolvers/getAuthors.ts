import { GraphQLError } from "graphql";

import type { QueryResolvers } from "@/apollo/generated/resolvers";
import { logger } from "@repo/logger";
import type { ContextValue } from ".";

export const getAuthors: QueryResolvers<ContextValue>["getAuthors"] = async (
	_,
	__,
	{ userId, prisma },
) => {
	try {
		const users = await prisma.users.findMany({
			select: {
				id: true,
				public_count: true,
				private_count: true,
				draft_count: true,
			},
			orderBy: {
				id: "asc",
			},
		});

		return users
			.map((user) => {
				const { id, public_count, private_count, draft_count } = user;
				return {
					name: id,
					count:
						userId === undefined
							? public_count
							: public_count + private_count + draft_count,
				};
			})
			.filter(({ count }) => count > 0);
	} catch (err: unknown) {
		logger.error({ err, on: "getAuthors" }, "Failed to get authors");
		if (err instanceof GraphQLError) {
			throw err;
		}
		throw new GraphQLError(`Internal server error: ${err}`);
	}
};

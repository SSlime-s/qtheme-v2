import { GraphQLError } from "graphql";

import { getHistoryFromDb } from "./utils/getHistoryFromDb";
import { getThemeFromDb } from "./utils/getThemeFromDb";

import type { QueryResolvers } from "@/apollo/generated/resolvers";
import { logger } from "@/utils/logger";
import type { ContextValue } from ".";

export const getTheme: QueryResolvers<ContextValue>["getTheme"] = async (
	_,
	args,
	{ userId, prisma },
) => {
	const { id } = args;
	try {
		const theme = await prisma.$transaction(async (prisma) => {
			const theme = await getThemeFromDb(prisma, id, userId);
			if (theme === null) {
				throw new GraphQLError("Not found");
			}
			const history = await getHistoryFromDb(prisma, id);
			return {
				theme,
				versions: history,
			};
		});

		return theme;
	} catch (err: unknown) {
		logger.error({ err, on: "getTheme", args }, "Failed to get theme");
		if (err instanceof GraphQLError) {
			throw err;
		}
		throw new GraphQLError(`Internal server error: ${err}`);
	}
};

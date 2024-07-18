import { GraphQLError } from "graphql";

import type { MutationResolvers } from "@/apollo/generated/resolvers";
import { logger } from "@/utils/logger";
import type { ContextValue } from ".";

export const toggleLike: MutationResolvers<ContextValue>["toggleLike"] = async (
	_,
	args,
	{ userId, prisma },
) => {
	if (userId === undefined) {
		throw new GraphQLError("Forbidden");
	}
	try {
		await prisma.$transaction(async (prisma) => {
			const { id, isLike } = args;
			const count = await prisma.themes.count({
				where: {
					id,
				},
			});
			if (count === 0) {
				throw new GraphQLError("Not found");
			}
			if (isLike) {
				await prisma.likes.create({
					data: {
						user_id: userId,
						theme_id: id,
					},
				});
			} else {
				await prisma.likes.delete({
					where: {
						user_id_theme_id: {
							theme_id: id,
							user_id: userId,
						},
					},
				});
			}
		});
	} catch (err: unknown) {
		logger.error({ err, on: "toggleLike", args }, "Failed to toggle like");
		if (err instanceof GraphQLError) {
			throw err;
		}
		throw new GraphQLError(`Internal server error: ${err}`);
	}
	// TODO: ほんとは DB から取ってきたほうがいい
	return {
		isLike: args.isLike,
		// TODO: 今はどこにも使われてないため一旦は仮置き
		likes: 0,
	};
};

import { GraphQLError } from "graphql";

import type { MutationResolvers } from "@/apollo/generated/resolvers";
import type { ContextValue } from ".";

export const deleteTheme: MutationResolvers<ContextValue>["deleteTheme"] =
	async (_, args, { userId, revalidate, prisma }) => {
		const { id } = args;
		try {
			await prisma.$transaction(async (prisma) => {
				await prisma.themes.delete({
					where: {
						id,
						author_user_id: userId,
					},
				});
				type Count = { count: bigint }[];
				const count =
					await prisma.$queryRaw<Count>`SELECT ROW_COUNT() AS count`;
				if (Number(count[0].count) === 0) {
					throw new GraphQLError("Not found");
				}

				await revalidate?.(`/theme/${id}`);
			});

			return null;
		} catch (err: unknown) {
			console.error(err);
			if (err instanceof GraphQLError) {
				throw err;
			}
			throw new GraphQLError(`Internal server error: ${err}`);
		}
	};

import { GraphQLError } from "graphql";
import { ulid } from "ulid";

import { bumpVersion } from "./utils/bumpVersion";
import { publishThemeWebhook } from "./utils/sendTraqWebhook";

import type {
	MutationResolvers,
	Theme,
	Type,
	Visibility,
} from "@/apollo/generated/resolvers";
import { logger } from "@/utils/logger";
import type { ContextValue } from ".";

export const createTheme: MutationResolvers<ContextValue>["createTheme"] =
	async (_, args, { userId, revalidate, prisma }) => {
		if (userId === undefined) {
			throw new GraphQLError("Forbidden");
		}
		try {
			return await prisma.$transaction(async (prisma) => {
				const { title, description, visibility, type, theme } = args;
				const id = ulid();
				const created = await prisma.themes.create({
					data: {
						id,
						title,
						description,
						author_user_id: userId,
						visibility,
						type,
						theme,
					},
				});
				const version_id = ulid();
				const version = bumpVersion();
				if (version === null) {
					throw new GraphQLError("Internal server error");
				}

				await prisma.theme_versions.create({
					data: {
						id: version_id,
						theme_id: id,
						version,
						theme,
					},
				});

				if (visibility !== "draft") {
					await publishThemeWebhook({
						author: userId,
						themeId: id,
						title,
					}).catch((err: unknown) => {
						logger.error(
							{ err, on: "createTheme", args },
							"Failed to send webhook",
						);
					});
				}

				await revalidate?.(`/theme/${id}`);

				{
					const {
						created_at,
						author_user_id,
						type,
						visibility,
						...createdRest
					} = created;

					return {
						...createdRest,
						author: author_user_id,
						createdAt: created_at,
						type: (type ?? "other") as Type,
						visibility: visibility as Visibility,
						likes: 0,
						isLike: false,
					} satisfies Theme;
				}
			});
		} catch (err: unknown) {
			logger.error({ err, on: "createTheme", args }, "Failed to create theme");
			if (err instanceof GraphQLError) {
				throw err;
			}
			throw new GraphQLError(`Internal server error: ${err}`);
		}
	};

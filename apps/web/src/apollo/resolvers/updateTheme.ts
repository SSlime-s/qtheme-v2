import { GraphQLError } from "graphql";
import { ulid } from "ulid";

import { bumpVersion } from "./utils/bumpVersion";
import { getLatestHistoryFromDb } from "./utils/getHistoryFromDb";
import { getThemeFromDb } from "./utils/getThemeFromDb";
import { publishThemeWebhook } from "./utils/sendTraqWebhook";

import type {
	MutationResolvers,
	Theme,
	Type,
	Visibility,
} from "@/apollo/generated/resolvers";
import { logger } from "@/utils/logger";
import type { ContextValue } from ".";

export const updateTheme: MutationResolvers<ContextValue>["updateTheme"] =
	async (_, args, { userId, revalidate, prisma }) => {
		if (userId === undefined) {
			throw new GraphQLError("Forbidden");
		}

		try {
			const theme = await prisma.$transaction(async (prisma) => {
				const { id, title, description, visibility, type, theme } = args;

				const oldTheme = await getThemeFromDb(prisma, id, userId);
				if (oldTheme === null) {
					throw new GraphQLError("Not found");
				}
				if (oldTheme.author !== userId) {
					throw new GraphQLError("Forbidden");
				}

				const newTheme = await prisma.themes.update({
					data: {
						title,
						description,
						visibility,
						type,
						theme,
					},
					where: {
						id,
						// 念のため author_user_id も確認
						author_user_id: userId,
					},
				});

				if (oldTheme.theme !== newTheme.theme) {
					const latestVersion = await getLatestHistoryFromDb(prisma, id);
					if (latestVersion === null) {
						throw new GraphQLError("Internal server error");
					}
					const newVersion = bumpVersion(latestVersion.version);
					if (newVersion === null) {
						throw new GraphQLError("Internal server error");
					}
					const version_id = ulid();

					await prisma.theme_versions.create({
						data: {
							id: version_id,
							theme_id: id,
							version: newVersion,
							theme,
						},
					});
				}

				if (
					oldTheme.visibility === "draft" &&
					newTheme.visibility !== "draft"
				) {
					await publishThemeWebhook({
						author: userId,
						themeId: id,
						title,
					}).catch((err: unknown) => {
						logger.error(
							{ err, on: "updateTheme", args },
							"Failed to send webhook",
						);
					});
				}

				await revalidate?.(`/theme/${id}`);

				return {
					...oldTheme,
					title: newTheme.title,
					description: newTheme.description,
					visibility: newTheme.visibility as Visibility,
					type: (newTheme.type ?? "other") as Type,
					theme: newTheme.theme,
				} satisfies Theme;
			});

			return theme;
		} catch (err: unknown) {
			logger.error({ err, on: "updateTheme", args }, "Failed to update theme");
			if (err instanceof GraphQLError) {
				throw err;
			}
			throw new GraphQLError(`Internal server error: ${err}`);
		}
	};

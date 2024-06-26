import { print } from "graphql";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

import { useClient } from "@/utils/api";
import { themeFromRaw } from "@/utils/theme/hooks";
import { resolveTheme } from "@repo/theme/resolve";

import { RandomDocument, getSdk } from "./getRandom.generated";

import type { Type } from "@/apollo/generated/graphql";

export const useRandomTheme = (type: Lowercase<Type> | null) => {
	const client = useClient();
	const sdk = useMemo(() => getSdk(client), [client]);

	const { data, error, isLoading, mutate } = useSWR(
		[
			print(RandomDocument),
			{
				type: type?.toUpperCase(),
			},
		],
		async ([_, variables]) => {
			const { getRandomTheme } = await sdk.Random(variables);
			return themeFromRaw(getRandomTheme);
		},
		{
			revalidateOnFocus: false,
		},
	);

	const resolvedTheme = useMemo(() => {
		if (data === undefined) return null;
		return resolveTheme(data.theme);
	}, [data]);

	const changeNext = useCallback(async () => {
		await mutate();
	}, [mutate]);

	const toggleLike = useCallback(
		async (isLike: boolean) => {
			if (data === undefined) return;
			const id = data.id;

			const {
				toggleLike: { isLike: newIsLike },
			} = await sdk.Random_ToggleLike({ id, isLike });

			await mutate((data) => {
				if (data === undefined) return;
				if (data.id !== id) return data;
				if (data.isLike === newIsLike) return data;

				return {
					...data,
					isLike: newIsLike,
					likes: data.likes + (newIsLike ? 1 : -1),
				};
			}, false);

			void (async () => {
				const { getTheme } = await sdk.Random_GetThemeLike({ id });

				if (getTheme === null || getTheme === undefined) return;

				await mutate((data) => {
					if (data === undefined) return;
					if (data.id !== id) return data;

					return {
						...data,
						isLike: getTheme.theme.isLike,
						likes: getTheme.theme.likes,
					};
				}, false);
			})();

			return newIsLike;
		},
		[data, mutate, sdk],
	);

	return useMemo(
		() => ({
			theme: data ?? null,
			resolvedTheme,
			isLoading,
			error,
			mutate: {
				changeNext,
				toggleLike,
			},
		}),
		[changeNext, data, error, isLoading, resolvedTheme, toggleLike],
	);
};

import { print } from "graphql";
import { useCallback, useMemo } from "react";
import useSWRInfinite from "swr/infinite";

import { useClient } from "@/utils/api";
import { THEMES_PER_PAGE, themeFromRaw } from "@/utils/theme/hooks";

import { FavoritesDocument, getSdk } from "./getFavorite.generated";

export const useFavoritesList = (
  type: "light" | "dark" | "other" | null,
  visibility: "public" | "private" | "draft" | null,
  pageSize: number = THEMES_PER_PAGE,
) => {
  const client = useClient();

  const { data, error, isLoading, mutate, setSize } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData !== null && previousPageData.themes.length === 0) {
        return null;
      }

      return [
        print(FavoritesDocument),
        {
          limit: pageSize,
          offset: index * pageSize,
          type: type?.toUpperCase() ?? null,
          visibility: visibility?.toUpperCase() ?? null,
        },
      ] as const;
    },
    async ([_, variables]) => {
      const sdk = getSdk(client);
      const { getThemes } = await sdk.Favorites(variables);
      if (getThemes === null || getThemes === undefined) {
        throw new Error("Theme not found");
      }

      return getThemes;
    },
  );

  const themes = useMemo(() => {
    return data ? data.flatMap((page) => page.themes.map(themeFromRaw)) : [];
  }, [data]);

  const total = useMemo(() => {
    return data ? data[data.length - 1].total : 0;
  }, [data]);

  const loadMore = useCallback(async () => {
    await setSize((size) => size + 1);
  }, [setSize]);

  const isEmpty = useMemo(() => {
    return data?.[0].themes.length === 0;
  }, [data]);

  const isReachingEnd = useMemo(() => {
    return isEmpty || (data && data[data.length - 1].themes.length < pageSize);
  }, [data, isEmpty, pageSize]);

  const toggleLike = useCallback(
    async (id: string, isLike: boolean) => {
      const sdk = getSdk(client);
      const {
        toggleLike: { isLike: isLikeNew },
      } = await sdk.Favorites_ToggleLike({ id, isLike });

      await mutate((data) => {
        if (!data) {
          return data;
        }

        return data.map((page) => {
          return {
            ...page,
            themes: page.themes
              .map((theme) => {
                if (theme.id === id) {
                  return {
                    ...theme,
                    isLike: isLikeNew,
                    likes:
                      isLikeNew === theme.isLike
                        ? theme.likes
                        : theme.likes + (isLikeNew ? 1 : -1),
                  };
                }
                return theme;
              })
              .filter((theme) => theme.isLike),
          };
        });
      });

      return;
    },
    [client, mutate],
  );

  return {
    themes,
    total,
    isReachingEnd,
    mutate: {
      loadMore,
      toggleLike,
    },
    error,
    isLoading,
  };
};

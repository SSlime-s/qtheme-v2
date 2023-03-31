import { useClient } from '@/utils/api'
import { themeFromRaw, THEMES_PER_PAGE } from '@/utils/theme/hooks'
import useSWRInfinite from 'swr/infinite'
import { Author_ThemesDocument, getSdk } from './AuthorThemes.generated'
import { print } from 'graphql'
import { useCallback, useMemo } from 'react'

export const useAuthorThemes = (
  author: string,
  type: 'light' | 'dark' | 'other' | null,
  pageSize: number = THEMES_PER_PAGE
) => {
  const client = useClient()

  const { data, error, isLoading, mutate, setSize } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData !== null && previousPageData.themes.length === 0) {
        return null
      }

      return [
        print(Author_ThemesDocument),
        {
          author,
          limit: pageSize,
          offset: index * pageSize,
          type: type?.toUpperCase() ?? null,
        },
      ] as const
    },
    async ([_, variables]) => {
      const sdk = getSdk(client)
      const { getThemes } = await sdk.Author_Themes(variables)
      if (getThemes === null || getThemes === undefined) {
        throw new Error('Theme not found')
      }

      return getThemes
    }
  )

  const themes = useMemo(() => {
    return data ? data.flatMap(page => page.themes.map(themeFromRaw)) : []
  }, [data])

  const total = useMemo(() => {
    return data ? data[data.length - 1].total : 0
  }, [data])

  const loadMore = useCallback(async () => {
    await setSize(size => size + 1)
  }, [setSize])

  const isEmpty = useMemo(() => {
    return data?.[0].themes.length === 0
  }, [data])

  const isReachingEnd = useMemo(() => {
    return isEmpty || (data && data[data.length - 1].themes.length < pageSize)
  }, [data, isEmpty, pageSize])

  const toggleLike = useCallback(
    async (id: string, isLike: boolean) => {
      const sdk = getSdk(client)
      const {
        toggleLike: { isLike: isLikeNew },
      } = await sdk.Author_ToggleLike({ id, isLike })

      await mutate(data => {
        if (!data) {
          return data
        }

        return data.map(page => {
          return {
            ...page,
            themes: page.themes.map(theme => {
              if (theme.id === id) {
                return {
                  ...theme,
                  isLike: isLikeNew,
                  likes:
                    isLikeNew === theme.isLike
                      ? theme.likes
                      : theme.likes + (isLikeNew ? 1 : -1),
                }
              }
              return theme
            }),
          }
        })
      }, false)

      // SWR の mutate の更新に任せると全部ロードされなおされちゃうので自前でロード
      void (async () => {
        const sdk = getSdk(client)
        const { getTheme } = await sdk.Author_Theme({ id })
        if (getTheme === null || getTheme === undefined) {
          throw new Error('Theme not found')
        }
        await mutate(data => {
          if (!data) {
            return data
          }

          return data.map(page => {
            return {
              ...page,
              themes: page.themes.map(theme => {
                if (theme.id === id) {
                  return {
                    ...theme,
                    isLike: getTheme.theme.isLike,
                    likes: getTheme.theme.likes,
                  }
                }
                return theme
              }),
            }
          })
        })
      })()

      return
    },
    [client, mutate]
  )

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
  }
}

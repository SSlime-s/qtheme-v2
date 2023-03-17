import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useClient } from '@/utils/api'
import { useCallback, useMemo, useState } from 'react'
import { Theme, themeSchema } from '@/model/theme'
import { resolveTheme } from '@/utils/theme'
import { lightTheme } from './default'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import { print } from 'graphql'

import { Theme as ThemeRes } from '@/apollo/generated/graphql'
import {
  getSdk as getSdkGetTheme,
  ThemeDocument,
} from '@/utils/graphql/getTheme.generated'
import { getSdk as getSdkToggleLike } from '@/utils/graphql/toggleLike.generated'
import {
  getSdk as getSdkGetThemes,
  ThemesDocument,
} from '@/utils/graphql/getThemes.generated'
import { getSdk as getSdkEditTheme } from '@/utils/graphql/editTheme.generated'

export const THEMES_PER_PAGE = 20

export interface FormattedTheme
  extends Omit<ThemeRes, 'theme' | 'type' | 'visibility'> {
  theme: Theme
  type: Lowercase<ThemeRes['type']>
  visibility: Lowercase<ThemeRes['visibility']>
}
export type ThemeInfo = Omit<FormattedTheme, 'theme'>

export const themeFromRaw = (raw: ThemeRes): FormattedTheme => {
  return {
    ...raw,
    theme: themeSchema.parse(JSON.parse(raw.theme)),
    type: raw.type.toLowerCase(),
    visibility: raw.visibility.toLowerCase(),
    createdAt: dayjs(raw.createdAt).format('YYYY/MM/DD'),
  }
}
export const themeToRaw = (theme: FormattedTheme): ThemeRes => {
  return {
    ...theme,
    theme: JSON.stringify(theme.theme),
    type: theme.type.toUpperCase(),
    visibility: theme.visibility.toUpperCase(),
    createdAt: dayjs(theme.createdAt).format(),
  }
}

const currentThemeWholeAtom = atom<FormattedTheme | null>(null)
const currentThemeAtom = atom(get => {
  const currentThemeWhole = get(currentThemeWholeAtom)
  return currentThemeWhole?.theme ?? null
})
const currentThemeInfoAtom = atom(get => {
  const currentThemeWhole = get(currentThemeWholeAtom)
  if (currentThemeWhole === null) return null
  const { theme: _, ...info } = currentThemeWhole
  return info
})
const currentThemeTmpAtom = atom<Theme | null>(null)

export const useCurrentTheme = () => {
  const client = useClient()

  const [currentTheme] = useAtom(currentThemeAtom)
  const [currentThemeInfo] = useAtom(currentThemeInfoAtom)
  const [_currentThemeWhole, setCurrentThemeWhole] = useAtom(
    currentThemeWholeAtom
  )
  const [currentThemeTmp, setCurrentThemeTmp] = useAtom(currentThemeTmpAtom)

  const currentResolvedTheme = useMemo(() => {
    return resolveTheme(currentThemeTmp ?? currentTheme ?? lightTheme)
  }, [currentTheme, currentThemeTmp])

  const changeToDefaultTheme = useCallback(() => {
    setCurrentThemeWhole(null)
  }, [setCurrentThemeWhole])

  const changeTheme = useCallback(
    async (id: string, fallback?: FormattedTheme) => {
      if (fallback) {
        setCurrentThemeWhole(fallback)
      }
      const sdk = getSdkGetTheme(client)
      const { getTheme } = await sdk.Theme({ id })

      if (getTheme === null || getTheme === undefined) {
        throw new Error('Theme not found')
      }

      const themeWhole = themeFromRaw(getTheme.theme)
      setCurrentThemeWhole(themeWhole)
    },
    [client, setCurrentThemeWhole]
  )

  const changeTmpTheme = useCallback(
    (theme: Theme) => {
      setCurrentThemeTmp(theme)
    },
    [setCurrentThemeTmp]
  )
  const resetTmpTheme = useCallback(() => {
    setCurrentThemeTmp(null)
  }, [setCurrentThemeTmp])

  return {
    currentTheme: currentResolvedTheme,
    currentRawTheme: currentTheme,
    currentThemeInfo,
    mutate: {
      changeTheme,
      changeToDefaultTheme,
      changeTmpTheme,
      resetTmpTheme,
    },
  }
}

export const useTheme = (id: string) => {
  const client = useClient()

  const { data, error, isLoading, mutate } = useSWR(
    [print(ThemeDocument), { id }],
    async ([_, variables]) => {
      const sdk = getSdkGetTheme(client)
      const { getTheme } = await sdk.Theme(variables)

      if (getTheme === null || getTheme === undefined) {
        throw new Error('Theme not found')
      }

      return themeFromRaw(getTheme.theme)
    }
  )

  const resolvedTheme = useMemo(() => {
    return resolveTheme(data?.theme ?? lightTheme)
  }, [data])

  const toggleLike = useCallback(
    async (isLike: boolean) => {
      if (data === undefined) return
      const sdk = getSdkToggleLike(client)
      const {
        toggleLike: { isLike: isLikeNew },
      } = await sdk.ToggleLike({ id: data.id, isLike })
      await mutate(data => {
        if (data === undefined) return data
        return {
          ...data,
          likes:
            isLikeNew === data.isLike
              ? data.likes
              : data.likes + (isLikeNew ? 1 : -1),
          isLike: isLikeNew,
        }
      })
    },
    [client, data, mutate]
  )

  const updateTheme = useCallback(
    async (
      theme: Pick<
        FormattedTheme,
        'title' | 'description' | 'theme' | 'type' | 'visibility'
      >
    ) => {
      const sdk = getSdkEditTheme(client)
      const { updateTheme } = await sdk.UpdateTheme({
        id,
        ...theme,
        type: theme.type.toUpperCase(),
        visibility: theme.visibility.toUpperCase(),
        theme: JSON.stringify(theme.theme),
      })
      await mutate(data => {
        if (data === undefined) return data
        return {
          ...data,
          ...themeFromRaw(updateTheme),
        }
      })
    },
    [client, id, mutate]
  )

  return {
    theme: data,
    resolvedTheme,
    error,
    isLoading,
    mutate: {
      toggleLike,
      updateTheme,
    },
  }
}

export const useThemeList = (
  type: 'light' | 'dark' | 'other' | null,
  visibility: 'public' | 'private' | 'draft' | null,
  filter: 'is_like' | 'is_mine' | null,
  pageSize: number = THEMES_PER_PAGE
) => {
  const client = useClient()

  const [delta, setDelta] = useState(0)

  const { data, error, isLoading, mutate, setSize } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData !== null && previousPageData.themes.length === 0) {
        return null
      }

      return [
        print(ThemesDocument),
        {
          limit: pageSize,
          offset: index * pageSize + delta,
          type: type?.toUpperCase() ?? null,
          visibility: visibility?.toUpperCase() ?? null,
          filter: filter?.toUpperCase() ?? null,
        },
      ] as const
    },
    async ([_, variables]) => {
      const sdk = getSdkGetThemes(client)
      const { getThemes } = await sdk.Themes(variables)
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
      const sdk = getSdkToggleLike(client)
      const {
        toggleLike: { isLike: isLikeNew },
      } = await sdk.ToggleLike({ id, isLike })

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
        const sdk = getSdkGetTheme(client)
        const { getTheme } = await sdk.Theme({ id })
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

  const createTheme = useCallback(
    async (
      theme: Pick<
        FormattedTheme,
        'title' | 'description' | 'theme' | 'type' | 'visibility'
      >
    ) => {
      const sdk = getSdkEditTheme(client)
      const { createTheme } = await sdk.CreateTheme({
        ...theme,
        type: theme.type.toUpperCase(),
        visibility: theme.visibility.toUpperCase(),
        theme: JSON.stringify(theme.theme),
      })

      void mutate(data => {
        if (!data) {
          return data
        }
        const newData = [...data]
        newData[0] = {
          ...newData[0],
          themes: [createTheme, ...newData[0].themes],
          total: newData[0].total + 1,
        }
        return newData
      }, false)
      setDelta(delta => delta + 1)
      return createTheme
    },
    [client, mutate]
  )

  const updateTheme = useCallback(
    async (
      id: string,
      theme: Pick<
        FormattedTheme,
        'title' | 'description' | 'theme' | 'type' | 'visibility'
      >
    ) => {
      const sdk = getSdkEditTheme(client)
      const { updateTheme } = await sdk.UpdateTheme({
        id,
        ...theme,
        type: theme.type.toUpperCase(),
        visibility: theme.visibility.toUpperCase(),
        theme: JSON.stringify(theme.theme),
      })
      void mutate(data => {
        if (!data) {
          return data
        }

        return data.map(page => {
          return {
            ...page,
            themes: page.themes.map(oldTheme => {
              if (oldTheme.id !== id) {
                return oldTheme
              }
              return {
                ...oldTheme,
                ...updateTheme,
              }
            }),
          }
        })
      }, false)
    },
    [client, mutate]
  )

  const deleteTheme = useCallback(
    async (id: string) => {
      const sdk = getSdkEditTheme(client)
      await sdk.DeleteTheme({ id })
      void mutate(data => {
        if (!data) {
          return data
        }

        return data.map(page => {
          return {
            ...page,
            themes: page.themes.filter(theme => theme.id !== id),
          }
        })
      }, false)
      setDelta(delta => delta - 1)
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
      createTheme,
      updateTheme,
      deleteTheme,
    },
    error,
    isLoading,
  }
}

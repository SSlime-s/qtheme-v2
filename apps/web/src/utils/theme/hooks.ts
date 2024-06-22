import { themeSchema } from '@repo/theme'
import { lightTheme } from '@repo/theme/default'
import { resolveTheme } from '@repo/theme/resolve'
import dayjs from 'dayjs'
import { print } from 'graphql'
import { atom, useAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { newClient, useClient } from '@/utils/api'
import { getSdk as getSdkEditTheme } from '@/utils/graphql/editTheme.generated'
import {
  getSdk as getSdkGetTheme,
  ThemeDocument,
} from '@/utils/graphql/getTheme.generated'
import {
  getSdk as getSdkGetThemes,
  ThemesDocument,
} from '@/utils/graphql/getThemes.generated'
import { getSdk as getSdkToggleLike } from '@/utils/graphql/toggleLike.generated'

import type { Theme as ThemeRes } from '@/apollo/generated/graphql'
import type { Sdk as SdkGetThemes } from '@/utils/graphql/getThemes.generated'
import type { Theme } from '@repo/theme'

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
    async (id?: string, fallback?: FormattedTheme) => {
      if (id === undefined && fallback === undefined) {
        throw new Error('id or fallback must be specified')
      }

      if (fallback !== undefined) {
        setCurrentThemeWhole(fallback)
      }
      if (id === undefined) {
        return
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

/**
 * @param id SSG による fallback 用の場合は undefined が降ってくるため、その場合は id が降ってくるのを待つ
 */
export const useTheme = (
  id: string | undefined,
  fallbackData?: FormattedTheme
) => {
  const client = useClient()

  const { data, error, isLoading, mutate } = useSWR(
    id !== undefined ? [print(ThemeDocument), { id }] : null,
    async ([_, variables]) => {
      const sdk = getSdkGetTheme(client)
      const { getTheme } = await sdk.Theme(variables)

      if (getTheme === null || getTheme === undefined) {
        throw new Error('Theme not found')
      }

      return themeFromRaw(getTheme.theme)
    },
    {
      fallbackData,
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
      if (id === undefined) return
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

  const deleteTheme = useCallback(async () => {
    if (id === undefined) return
    const sdk = getSdkEditTheme(client)
    await sdk.DeleteTheme({ id })
    await mutate(undefined)
  }, [client, id, mutate])

  return {
    theme: data,
    resolvedTheme,
    error,
    isLoading,
    mutate: {
      toggleLike,
      updateTheme,
      deleteTheme,
    },
  }
}

type VariablesUseThemeList = Parameters<SdkGetThemes['Themes']>[0]
async function fetcherUseThemeList(
  client: ReturnType<typeof useClient>,
  variables: VariablesUseThemeList
) {
  const sdk = getSdkGetThemes(client)
  const { getThemes } = await sdk.Themes(variables)
  if (getThemes === null || getThemes === undefined) {
    throw new Error('Theme not found')
  }

  return getThemes
}
export async function prefetchUseThemeList(
  type: 'light' | 'dark' | 'other' | null,
  visibility: 'public' | 'private' | 'draft' | null,
  pageSize: number = THEMES_PER_PAGE
) {
  const initialVariables = {
    limit: pageSize,
    offset: 0,
    type: type?.toUpperCase() ?? null,
    visibility: visibility?.toUpperCase() ?? null,
  } as const satisfies VariablesUseThemeList

  const client = newClient()

  return await fetcherUseThemeList(client, initialVariables)
}
export const useThemeList = (
  type: 'light' | 'dark' | 'other' | null,
  visibility: 'public' | 'private' | 'draft' | null,
  pageSize: number = THEMES_PER_PAGE,
  initialData?: Awaited<ReturnType<SdkGetThemes['Themes']>>['getThemes']
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
        },
      ] as const
    },
    async ([_, variables]) => {
      return await fetcherUseThemeList(client, variables)
    },
    {
      fallbackData:
        initialData === undefined || initialData === null
          ? undefined
          : [initialData],
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

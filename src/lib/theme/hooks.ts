import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useClient } from '@/lib/api'
import { gql } from 'graphql-request'
import { useCallback, useMemo, useState } from 'react'
import { Theme } from '@/model/theme'
import { resolveTheme } from '@/lib/theme'
import { lightTheme } from './default'

const THEMES_PER_PAGE = 20

const randomQuery = gql`
  query Random($visibility: Visibility, $type: Type) {
    getRandomTheme(visibility: $visibility, type: $type) {
      author
      createdAt
      description
      id
      isLike
      likes
      theme
      title
      type
      visibility
    }
  }
`

const getThemeQuery = gql`
  query GetTheme($id: ID!) {
    getTheme(id: $id) {
      theme {
        author
        createdAt
        description
        id
        isLike
        likes
        theme
        title
        type
        visibility
      }
    }
  }
`

const getThemeListQuery = gql`
  query GetThemes(
    $limit: Int
    $offset: Int
    $visibility: Visibility
    $type: Type
    $only_like: Boolean
    $author: String
  ) {
    getThemes(
      limit: $limit
      offset: $offset
      visibility: $visibility
      type: $type
      only_like: $only_like
      $author: $author
    ) {
      themes {
        author
        createdAt
        description
        id
        isLike
        likes
        theme
        title
        type
        visibility
      }
      total
    }
  }
`

const toggleLikeMutation = gql`
  mutation ToggleLike($id: ID!, $isLike: Boolean!) {
    toggleLike(id: $id, isLike: $isLike) {
      isLike
    }
  }
`

export const createThemeMutation = gql`
  mutation CreateTheme(
    $title: String!
    $description: String!
    $visibility: Visibility!
    $type: Type!
    $theme: String!
  ) {
    createTheme(
      title: $title
      description: $description
      visibility: $visibility
      type: $type
      theme: $theme
    )
  }
`
export interface CreateThemeInput {
  title: string
  description: string
  visibility: 'public' | 'private' | 'draft'
  type: 'light' | 'dark' | 'other'
  theme: Theme
}

export const updateThemeMutation = gql`
  mutation UpdateTheme(
    id: ID!
    $title: String!
    $description: String!
    $visibility: Visibility!
    $type: Type!
    $theme: String!
  ) {
    updateTheme(
      id: $id
      title: $title
      description: $description
      visibility: $visibility
      type: $type
      theme: $theme
    )
  }
`
export interface UpdateThemeInput extends CreateThemeInput {
  id: string
}

export const deleteThemeMutation = gql`
  mutation DeleteTheme($id: ID!) {
    deleteTheme(id: $id)
  }
`
export interface DeleteThemeInput {
  id: string
}

interface ThemeInfo {
  id: string
  author: string
  title: string
  description: string
  type: 'light' | 'dark' | 'other'
  visibility: 'public' | 'private' | 'draft'
  createdAt: string
  likes: number
  isLike: boolean
}

interface ThemeWhole extends ThemeInfo {
  theme: Theme
}

export const useTheme = () => {
  const client = useClient()

  const { data: currentTheme, mutate: currentThemeMutate } =
    useSWR<Theme | null>('currentTheme', null, {
      fallbackData: null,
    })
  const { data: currentThemeInfo, mutate: currentThemeInfoMutate } =
    useSWR<ThemeInfo | null>('currentThemeInfo', null, {
      fallbackData: null,
    })

  const currentResolvedTheme = useMemo(() => {
    return resolveTheme(currentTheme ?? lightTheme)
  }, [currentTheme])

  const changeToDefaultTheme = useCallback(() => {
    currentThemeMutate(null)
    currentThemeInfoMutate(null)
  }, [currentThemeInfoMutate, currentThemeMutate])

  const changeTheme = useCallback(
    async (id: string, fallback?: ThemeWhole) => {
      if (fallback) {
        currentThemeMutate(fallback.theme)
        currentThemeInfoMutate({
          ...fallback,
        })
      }
      const { getTheme } = await client.request(getThemeQuery, { id })
      currentThemeMutate(getTheme.theme.theme)
      currentThemeInfoMutate({
        ...getTheme.theme,
      })
    },
    [client, currentThemeInfoMutate, currentThemeMutate]
  )

  return {
    currentTheme: currentResolvedTheme,
    currentThemeInfo,
    mutate: {
      changeTheme,
      changeToDefaultTheme,
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

  const { data, error, isLoading, mutate, setSize } = useSWRInfinite<{
    themes: ThemeWhole[]
    total: number
  }>(
    (index, previousPageData) => {
      if (previousPageData !== null && previousPageData.themes.length === 0) {
        return null
      }

      return [
        getThemeListQuery,
        {
          limit: pageSize,
          offset: index * pageSize + delta,
          type: type?.toUpperCase() ?? null,
          visibility: visibility?.toUpperCase() ?? null,
          filter: filter?.toUpperCase() ?? null,
        },
      ]
    },
    async ([query, variables]) => {
      const { getThemes } = await client.request(query, variables)
      return getThemes
    }
  )

  const themes = useMemo(() => {
    return data ? data.flatMap(page => page.themes) : []
  }, [data])

  const total = useMemo(() => {
    return data ? data[data.length - 1].total : 0
  }, [data])

  const loadMore = useCallback(() => {
    setSize(size => size + 1)
  }, [setSize])

  const isEmpty = useMemo(() => {
    return data?.[0].themes.length === 0
  }, [data])

  const isReachingEnd = useMemo(() => {
    return isEmpty || (data && data[data.length - 1].themes.length < pageSize)
  }, [data, isEmpty, pageSize])

  const toggleLike = useCallback(
    async (id: string, isLike: boolean) => {
      await client.request(toggleLikeMutation, { id, isLike })
      mutate(data => {
        if (!data) {
          return data
        }
        const newData = [...data]
        return newData.map(page => {
          return {
            ...page,
            themes: page.themes.map(theme => {
              if (theme.id === id) {
                return {
                  ...theme,
                  isLike,
                  likes: isLike ? theme.likes + 1 : theme.likes - 1,
                }
              }
              return theme
            }),
          }
        })
      }, false)

      // SWR の mutate の更新に任せると全部ロードされなおされちゃうので自前でロード
      void (async () => {
        const { getTheme } = await client.request(getThemeQuery, { id })
        mutate(data => {
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
      })

      return
    },
    [client, mutate]
  )

  const createTheme = useCallback(
    async (
      theme: Pick<
        ThemeWhole,
        'title' | 'description' | 'theme' | 'type' | 'visibility'
      >
    ) => {
      const { createTheme } = await client.request(createThemeMutation, {
        theme,
      })
      mutate(data => {
        if (!data) {
          return data
        }
        const newData = [...data]
        newData[0].themes.unshift(createTheme)
        newData[0].total += 1
        return newData
      }, false)
      setDelta(delta => delta + 1)
    },
    [client, mutate]
  )

  const updateTheme = useCallback(
    async (
      id: string,
      theme: Pick<
        ThemeWhole,
        'title' | 'description' | 'theme' | 'type' | 'visibility'
      >
    ) => {
      const { updateTheme } = await client.request(updateThemeMutation, {
        id,
        theme,
      })
      mutate(data => {
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
      await client.request(deleteThemeMutation, { id })
      mutate(data => {
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

export const useRandomTheme = (type: 'light' | 'dark' | 'other' | null) => {
  const client = useClient()

  const { data, error, isLoading, mutate } = useSWR<ThemeWhole>(
    [
      randomQuery,
      {
        type: type?.toUpperCase() ?? null,
      },
    ],
    async ([query, variables]) => {
      const { randomTheme } = await client.request(query, variables)
      return randomTheme
    },
    {
      revalidateOnFocus: false,
    }
  )

  const randomTheme = useMemo(() => {
    return data ? resolveTheme(data.theme) : null
  }, [data])

  const randomThemeInfo = useMemo((): ThemeInfo | null => {
    return data ? data : null
  }, [data])

  const changeNext = useCallback(async () => {
    mutate()
  }, [mutate])

  const toggleLike = useCallback(
    async (isLike: boolean) => {
      if (!data) {
        return
      }
      const id = data.id
      await client.request(toggleLikeMutation, { id, isLike })
      mutate(data => {
        if (!data) {
          return data
        }
        return {
          ...data,
          isLike,
          likes: isLike ? data.likes + 1 : data.likes - 1,
        }
      }, false)

      // SWR の mutate の更新に任せると違うテーマになっちゃうので自前でロード
      void (async () => {
        const { getTheme } = await client.request(getThemeQuery, { id })

        mutate(data => {
          if (!data) {
            return data
          }
          return {
            ...data,
            isLike: getTheme.theme.isLike,
            likes: getTheme.theme.likes,
          }
        })
      })
    },
    [client, data, mutate]
  )

  return {
    randomTheme,
    randomThemeInfo,
    mutate: {
      changeNext,
      toggleLike,
    },
    error,
    isLoading,
  }
}
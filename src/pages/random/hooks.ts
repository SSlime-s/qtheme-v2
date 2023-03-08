import { useClient } from '@/utils/api'
import { useCallback, useMemo } from 'react'
import { getSdk, RandomDocument } from './getRandom.generated'
import useSWR from 'swr'
import { print } from 'graphql'
import { Type } from '@/apollo/generated/graphql'
import { themeFromRaw } from '@/utils/theme/hooks'
import { resolveTheme } from '@/utils/theme'

export const useRandomTheme = (type: Lowercase<Type> | null) => {
  const client = useClient()
  const sdk = useMemo(() => getSdk(client), [client])

  const { data, error, isLoading, mutate } = useSWR(
    [
      print(RandomDocument),
      {
        type: type?.toUpperCase(),
      },
    ],
    async ([_, variables]) => {
      const { getRandomTheme } = await sdk.Random(variables)
      return themeFromRaw(getRandomTheme)
    },
    {
      revalidateOnFocus: false,
      suspense: true,
    }
  )

  const resolvedTheme = useMemo(() => {
    return resolveTheme(data.theme)
  }, [data])

  const changeNext = useCallback(async () => {
    await mutate()
  }, [mutate])

  const toggleLike = useCallback(
    async (isLike: boolean) => {
      const id = data.id

      const {
        toggleLike: { isLike: newIsLike },
      } = await sdk.ToggleLike({ id, isLike })

      await mutate(data => {
        if (data === undefined) return
        if (data.id !== id) return data
        if (data.isLike === newIsLike) return data

        return {
          ...data,
          isLike: newIsLike,
          likes: data.likes + (newIsLike ? 1 : -1),
        }
      }, false)

      void (async () => {
        const { getTheme } = await sdk.GetThemeLike({ id })

        if (getTheme === null || getTheme === undefined) return

        await mutate(data => {
          if (data === undefined) return
          if (data.id !== id) return data

          return {
            ...data,
            isLike: getTheme.theme.isLike,
            likes: getTheme.theme.likes,
          }
        }, false)
      })()

      return newIsLike
    },
    [data, mutate, sdk]
  )

  return useMemo(
    () => ({
      theme: data,
      resolvedTheme,
      error,
      mutate: {
        changeNext,
        toggleLike,
      },
    }),
    [changeNext, data, error, resolvedTheme, toggleLike]
  )
}

import { print } from 'graphql'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { match } from 'ts-pattern'

import { useClient } from '@/utils/api'

import { getSdk, AuthorsDocument } from './getAuthors.generated'

export const useAuthors = () => {
  const client = useClient()
  const sdk = useMemo(() => {
    return getSdk(client)
  }, [client])

  const { data, error, isLoading } = useSWR(
    print(AuthorsDocument),
    async () => {
      const { getAuthors } = await sdk.Authors()
      return getAuthors
    }
  )

  const [filterWord, setFilterWord] = useState('')
  const filteredData = useMemo(() => {
    if (data === undefined) return []

    const check = (word: string, target: string) => {
      return match([word.startsWith('^'), word.endsWith('$')])
        .with([true, true], () => word.slice(1, -1) === target)
        .with([true, false], () => target.startsWith(word.slice(1)))
        .with([false, true], () => target.endsWith(word.slice(0, -1)))
        .otherwise(() => target.includes(word))
    }

    return data.filter(author => check(filterWord, author.name))
  }, [data, filterWord])

  return {
    data: {
      raw: data,
      filterWord,
      filtered: filteredData,
    },
    error,
    isLoading,
    mutate: {
      setFilterWord,
    },
  }
}

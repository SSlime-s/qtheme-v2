import { print } from 'graphql'
import { useMemo } from 'react'
import useSWR from 'swr'

import { getSdk, AuthorsDocument } from './getAuthors.generated'

import { useClient } from '@/utils/api'

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

  return {
    data,
    error,
    isLoading,
  }
}

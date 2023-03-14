import { useClient } from '@/utils/api'
import { useMemo } from 'react'
import { getSdk, AuthorsDocument } from './getAuthors.generated'
import useSWR from 'swr'
import { print } from 'graphql'

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

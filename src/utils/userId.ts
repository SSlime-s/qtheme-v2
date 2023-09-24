import { print } from 'graphql'
import { useMemo } from 'react'
import useSWR from 'swr'

import { useClient } from './api'
import { WhoamiDocument, getSdk } from './graphql/whoami.generated'

/**
 * @deprecated remove this (nop)
 */
export const useSetUserId = (_userId: string | null) => {
  // nop
}

export const useUserId = () => {
  const client = useClient()
  const sdk = useMemo(() => {
    return getSdk(client)
  }, [client])

  const { data } = useSWR(print(WhoamiDocument), async () => {
    const { getMe } = await sdk.Whoami()

    return getMe ?? null
  })

  return data ?? null
}

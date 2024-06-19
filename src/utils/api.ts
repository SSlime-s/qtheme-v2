import { GraphQLClient } from 'graphql-request'
import { useMemo } from 'react'

import { BASE_URL } from './baseUrl'

const ENDPOINT = `${BASE_URL}/api/graphql`

export const useClient = () => {
  const client = useMemo(() => newClient(), [])

  return client
}
export const newClient = () => {
  return new GraphQLClient(
    ENDPOINT,
    process.env.NODE_ENV === 'development'
      ? {
          headers:
            process.env.DEBUG_USER !== undefined
              ? {
                  'X-Forwarded-User': process.env.DEBUG_USER,
                }
              : {},
          fetch: fetch,
        }
      : {
          credentials: 'include',
          fetch: fetch,
        }
  )
}

export const userIconUrl = (userId: string) => {
  return `https://q.trap.jp/api/1.0/public/icon/${userId}`
}

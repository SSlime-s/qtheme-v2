import { GraphQLClient } from 'graphql-request'
import { useMemo } from 'react'

const ENDPOINT = `/api/graphql`

export const useClient = () => {
  const client = useMemo(
    () =>
      new GraphQLClient(
        ENDPOINT,
        process.env.NODE_ENV === 'development'
          ? {
              headers: {
                'X-Showcase-User': 'SSlime',
              },
            }
          : {
              credentials: 'include',
            }
      ),
    []
  )

  return client
}

export const userIconUrl = (userId: string) => {
  return `https://q.trap.jp/api/1.0/public/icon/${userId}`
}

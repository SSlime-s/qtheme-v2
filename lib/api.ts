import { GraphQLClient } from 'graphql-request'
import { useMemo } from 'react'

const ENDPOINT = `${window.location.origin}/api/graphql`
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

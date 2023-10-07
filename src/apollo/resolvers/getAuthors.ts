import { GraphQLError } from 'graphql'

import type { ContextValue } from '.'
import type { QueryResolvers } from '@/apollo/generated/resolvers'

export const getAuthors: QueryResolvers<ContextValue>['getAuthors'] = async (
  _,
  __,
  { userId, prisma }
) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        public_count: true,
        private_count: true,
        draft_count: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return users
      .map(user => {
        const { id, public_count, private_count, draft_count } = user
        return {
          name: id,
          count:
            userId === undefined
              ? public_count
              : public_count + private_count + draft_count,
        }
      })
      .filter(({ count }) => count > 0)
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof GraphQLError) {
      throw err
    }
    throw new GraphQLError(`Internal server error: ${err}`)
  }
}

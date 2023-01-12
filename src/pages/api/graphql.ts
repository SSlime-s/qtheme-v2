import { ApolloServer } from 'apollo-server-micro'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolvers } from '@/apollo/resolvers'
import { typeDefs } from '@/apollo/type-defs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const userId = req.headers['x-showcase-user'] as string | undefined

    return {
      userId: userId === '-' ? undefined : userId,
      req,
      res,
    }
  },
})

const handler = apolloServer
  .start()
  .then(() => apolloServer.createHandler({ path: '/api/graphql' }))

const res = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, X-Showcase-User'
    )

    if (req.method === 'OPTIONS') {
      res.end()
      return false
    }
  }

  await (
    await handler
  )(req, res)
}
export default res

// export default apolloServer
//   .start()
//   .then(() => apolloServer.createHandler({ path: '/api/graphql' }))

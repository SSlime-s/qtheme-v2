import { GraphQLError } from 'graphql'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'
import { QueryResolvers } from '@/apollo/generated/resolvers'
import { getThemeFromDb } from './utils/getThemeFromDb'

export const getTheme: QueryResolvers<ContextValue>['getTheme'] = async (
  _,
  args,
  { userId, connection }
) => {
  const { id } = args
  const needCloseConnection = connection === undefined
  try {
    connection = connection ?? (await connectDb())
    const theme = await getThemeFromDb(connection, id, userId)
    if (theme === null) {
      throw new GraphQLError('Not found')
    }
    return {
      theme,
      // TODO: あとで実装する
      versions: [],
    }
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof GraphQLError) {
      throw err
    }
    throw new GraphQLError(`Internal server error: ${err}`)
  } finally {
    if (needCloseConnection) {
      await connection?.end()
    }
  }
}

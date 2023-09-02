import { GraphQLError } from 'graphql'

import { getHistoryFromDb } from './utils/getHistoryFromDb'
import { getThemeFromDb } from './utils/getThemeFromDb'

import type { ContextValue } from '.'
import type { QueryResolvers } from '@/apollo/generated/resolvers'

import { connectDb } from '@/model/db'

export const getTheme: QueryResolvers<ContextValue>['getTheme'] = async (
  _,
  args,
  { userId, connection }
) => {
  const { id } = args
  const needCloseConnection = connection === undefined
  try {
    connection = connection ?? (await connectDb())
    await connection.beginTransaction()
    const theme = await getThemeFromDb(connection, id, userId)
    if (theme === null) {
      throw new GraphQLError('Not found')
    }
    const history = await getHistoryFromDb(connection, id)
    await connection.commit()
    return {
      theme,
      versions: history,
    }
  } catch (err: unknown) {
    console.error(err)
    await connection?.rollback()
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

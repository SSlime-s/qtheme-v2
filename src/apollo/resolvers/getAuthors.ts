import { GraphQLError } from 'graphql'

import type { ContextValue } from '.'
import type { QueryResolvers } from '@/apollo/generated/resolvers'

import { connectDb } from '@/model/db'
import { assertIsArray, assertIsObject } from '@/utils/typeUtils'

interface Row {
  id: string
  publicCount: number
  privateCount: number
  draftCount: number
}
export const getAuthors: QueryResolvers<ContextValue>['getAuthors'] = async (
  _,
  __,
  { userId, connection }
) => {
  const needCloseConnection = connection === undefined
  try {
    connection = connection ?? (await connectDb())
    const sql = `
      SELECT
        id,
        public_count AS publicCount,
        private_count AS privateCount,
        draft_count AS draftCount
      FROM users
      ORDER BY id ASC
    `
    const [rows] = await connection.execute(sql)
    assertIsArray(rows)
    return rows
      .map(row => {
        assertIsObject(row)
        const { id, publicCount, privateCount } = row as Row
        return {
          name: id,
          count:
            userId === undefined ? publicCount : publicCount + privateCount,
        }
      })
      .filter(({ count }) => count > 0)
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

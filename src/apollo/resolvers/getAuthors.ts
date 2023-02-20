import { assertIsArray, assertIsObject } from '@/lib/typeUtils'
import { connectDb } from '@/model/db'
import { GraphQLError } from 'graphql'
import { ContextValue } from '.'
import { QueryResolvers } from '@/apollo/generated/resolvers'

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
    console.log(rows)
    assertIsArray(rows)
    return rows.map(row => {
      assertIsObject(row)
      const { id, publicCount, privateCount } = row as Row
      return {
        name: id,
        count: userId === undefined ? publicCount : publicCount + privateCount,
      }
    })
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

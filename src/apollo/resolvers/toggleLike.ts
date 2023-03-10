import { assertIsArrayObject } from '@/utils/typeUtils'
import { connectDb } from '@/model/db'
import { GraphQLError } from 'graphql'
import { Connection } from 'mysql2/promise'
import { ContextValue } from '.'
import { MutationResolvers } from '@/apollo/generated/resolvers'

export const toggleLike: MutationResolvers<ContextValue>['toggleLike'] = async (
  _,
  args,
  { userId }
) => {
  if (userId === undefined) {
    throw new GraphQLError('Forbidden')
  }
  const { id, isLike } = args
  let connection: Connection | undefined
  try {
    connection = await connectDb()
    await connection.beginTransaction()
    const sql = `
      SELECT COUNT(*) AS count
      FROM themes
      WHERE id = ?
    `
    const [rows] = await connection.execute(sql, [id])
    assertIsArrayObject(rows)
    if (rows[0].count === 0) {
      throw new GraphQLError('Not found')
    }
    if (isLike) {
      const sql = `
        INSERT INTO likes (
          user_id,
          theme_id
        ) VALUES (
          ?, ?
        )
      `
      await connection.execute(sql, [userId, id])
    } else {
      const sql = `
        DELETE FROM likes
        WHERE user_id = ?
          AND theme_id = ?
      `
      await connection.execute(sql, [userId, id])
    }
    await connection.commit()
  } catch (err: unknown) {
    await connection?.rollback()
    console.error(err)
    if (err instanceof GraphQLError) {
      throw err
    }
    throw new GraphQLError(`Internal server error: ${err}`)
  } finally {
    await connection?.end()
  }
  // TODO: ほんとは DB から取ってきたほうがいい
  return {
    isLike: args.isLike,
    // TODO: 今はどこにも使われてないため一旦は仮置き
    likes: 0
  }
}

import { GraphQLError } from 'graphql'
import { Connection } from 'mysql2/promise'
import { assertIsArrayObject } from '@/lib/typeUtils'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'

export const deleteTheme = async (
  _: unknown,
  args: {
    id: string
  },
  { userId }: ContextValue
) => {
  const { id } = args
  let connection: Connection | undefined
  try {
    connection = await connectDb()
    await connection.beginTransaction()
    const sql = `
      DELETE FROM themes
      WHERE id = ?
        AND author_user_id = ?
    `
    await connection.execute(sql, [id, userId])
    const [rows] = await connection.execute('SELECT ROW_COUNT() AS count', [])
    await connection.commit()
    assertIsArrayObject(rows)
    if (rows[0].count === 1) {
      return null
    }
    throw new GraphQLError('Not found')
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
}

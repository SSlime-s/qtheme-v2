import { GraphQLError } from 'graphql'
import { assertIsArray } from '@/lib/types'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'

export const getTheme = async (
  _: unknown,
  args: { id: string },
  { userId, connection }: ContextValue
) => {
  const { id } = args
  try {
    connection = connection ?? (await connectDb())
    const sql = `
          SELECT
            themes.id AS id,
            themes.title,
            themes.description,
            themes.author_user_id AS author,
            themes.visibility,
            themes.type,
            themes.created_at AS createdAt,
            themes.theme,
            CASE WHEN likes.count IS NULL THEN 0 ELSE likes.count END AS likes,
            ${
              userId === undefined
                ? 'FALSE'
                : 'CASE WHEN isLikes.isLike IS NULL THEN FALSE ELSE isLikes.isLike END'
            } AS isLike
          FROM themes
          LEFT JOIN (
            SELECT COUNT(*) AS count, theme_id
            FROM likes
            GROUP BY theme_id
          ) AS likes ON likes.theme_id = themes.id
          ${
            userId === undefined
              ? ''
              : `
            LEFT JOIN (
              SELECT theme_id, TRUE AS isLike
              FROM likes
              WHERE user_id = ?
            ) AS isLikes ON isLikes.theme_id = themes.id
          `
          }
          WHERE themes.id = ?
        `
    const [rows] = await connection.execute(sql, [
      ...(userId !== undefined ? [userId] : []),
      id,
    ])
    console.log(rows)
    assertIsArray(rows)
    if (rows.length === 0) {
      return null
    }
    return rows[0]
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof GraphQLError) {
      throw err
    }
    throw new GraphQLError(`Internal server error: ${err}`)
  }
}

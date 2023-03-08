import { GraphQLError } from 'graphql'
import { assertIsArray } from '@/utils/typeUtils'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'
import { QueryResolvers, Theme } from '@/apollo/generated/resolvers'

export const getTheme: QueryResolvers<ContextValue>['getTheme'] = async (
  _,
  args,
  { userId, connection }
) => {
  const { id } = args
  const needCloseConnection = connection === undefined
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
    return {
      theme: rows[0] as Theme,
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

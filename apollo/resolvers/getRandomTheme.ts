import { GraphQLError } from 'graphql'
import { assertIsArray } from '@/lib/types'
import { connectDb } from '@/model/db'
import { ContextValue } from './resolvers'

export const getRandomTheme = async (
  _parent: unknown,
  args: {
    visibility?: 'public' | 'private' | 'draft'
    type?: 'light' | 'dark' | 'other'
  },
  { userId, connection }: ContextValue
) => {
  const { visibility, type } = args
  if (visibility === 'draft') {
    throw new GraphQLError('Invalid visibility')
  }
  if (visibility === 'private' && userId === undefined) {
    throw new GraphQLError('Forbidden')
  }
  try {
    connection = connection ?? (await connectDb())
    if (userId === undefined) {
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
              likes.count AS likes,
              FALSE AS isLike
            FROM themes
            LEFT JOIN (
              SELECT COUNT(*) AS count, theme_id
              FROM likes
              GROUP BY theme_id
            ) AS likes ON likes.theme_id = themes.id
            WHERE
              themes.visibility = 'public'
              ${type === undefined ? '' : `AND themes.type = ?`}
            ORDER BY RAND()
            LIMIT 1
          `
      const [rows] = await connection.execute(sql, [
        ...(type !== undefined ? [type] : []),
      ])
      console.log(rows)
      assertIsArray(rows)
      if (rows.length === 0) {
        throw new GraphQLError('Not found')
      }
      return rows[0]
    } else {
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
              CASE WHEN isLikes.isLike IS NULL THEN FALSE ELSE isLikes.isLike END AS isLike
            FROM themes
            LEFT JOIN (
              SELECT COUNT(*) AS count, theme_id
              FROM likes
              GROUP BY theme_id
            ) AS likes ON likes.theme_id = themes.id
            LEFT JOIN (
              SELECT theme_id, TRUE AS isLike
              FROM likes
              WHERE user_id = ?
            ) AS isLikes ON isLikes.theme_id = themes.id
            WHERE
              ${
                visibility === undefined
                  ? 'themes.visibility IN ("public", "private")'
                  : 'themes.visibility = ?'
              }
              ${type === undefined ? '' : `AND themes.type = ?`}
            ORDER BY RAND()
            LIMIT 1
          `
      const [rows] = await connection.execute(sql, [
        userId,
        ...(visibility !== undefined ? [visibility] : []),
        ...(type !== undefined ? [type] : []),
      ])
      console.log(rows)
      assertIsArray(rows)
      if (rows.length === 0) {
        throw new GraphQLError('Not found')
      }
      return rows[0]
    }
  } catch (err: unknown) {
    console.error(err)
    throw new GraphQLError(`Internal server error: ${err}`)
  }
}

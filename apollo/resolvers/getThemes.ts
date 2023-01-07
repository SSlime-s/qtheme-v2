import { GraphQLError } from 'graphql'
import { assertIsArray, assertIsArrayObject } from '@/lib/types'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'

export const getThemes = async (
  _: unknown,
  args: {
    limits?: number
    offset?: number
    visibility?: 'public' | 'private' | 'draft'
    type?: 'light' | 'dark' | 'other'
    filter?: 'isLike' | 'isMine'
  },
  { userId, connection }: ContextValue
) => {
  const { limits, offset, visibility, type, filter } = args
  if (visibility === 'draft') {
    throw new GraphQLError('Invalid visibility')
  }
  if (visibility === 'private' && userId === undefined) {
    throw new GraphQLError('Forbidden')
  }
  if (filter !== undefined && userId === undefined) {
    throw new GraphQLError('Forbidden')
  }
  if (limits === undefined && offset !== undefined) {
    throw new GraphQLError('Invalid offset')
  }
  try {
    connection = connection ?? (await connectDb())
    const sql = `
          SELECT SQL_CALC_FOUND_ROWS
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
          WHERE
            ${
              visibility === undefined
                ? userId === undefined
                  ? 'themes.visibility = "public"'
                  : 'themes.visibility IN ("public", "private")'
                : 'themes.visibility = ?'
            }
            ${type === undefined ? '' : `AND themes.type = ?`}
            ${
              filter === undefined
                ? ''
                : filter === 'isLike'
                ? 'AND isLikes.isLike = TRUE'
                : 'AND themes.author_user_id = ?'
            }
          ORDER BY themes.created_at DESC
          ${limits === undefined ? '' : `LIMIT ?`}
          ${offset === undefined ? '' : `OFFSET ?`}
        `
    const [rows] = await connection.execute(sql, [
      ...(userId !== undefined ? [userId] : []),
      ...(visibility !== undefined ? [visibility] : []),
      ...(type !== undefined ? [type] : []),
      ...(limits !== undefined ? [limits] : []),
      ...(offset !== undefined ? [offset] : []),
      ...(filter === 'isMine' ? [userId] : []),
    ])
    console.log(rows)
    assertIsArray(rows)
    const [count] = await connection.execute('SELECT FOUND_ROWS() AS count')
    assertIsArrayObject(count)
    return {
      themes: rows,
      total: count[0].count,
    }
  } catch (err: unknown) {
    console.error(err)
    throw new GraphQLError(`Internal server error: ${err}`)
  }
}

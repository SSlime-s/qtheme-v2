import { GraphQLError } from 'graphql'
import { assertIsArray, assertIsArrayObject } from '@/lib/typeUtils'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'

export const getThemes = async (
  _: unknown,
  args: {
    limit?: number | null
    offset?: number | null
    visibility?: 'public' | 'private' | 'draft' | null
    type?: 'light' | 'dark' | 'other' | null
    only_like?: boolean | null
    author?: string | null
  },
  { userId, connection }: ContextValue
) => {
  const { limit, offset, visibility, type, only_like, author } = args
  if (visibility === 'draft') {
    throw new GraphQLError('Invalid visibility')
  }
  if (visibility === 'private' && userId == undefined) {
    throw new GraphQLError('Forbidden')
  }
  if (only_like === true && userId == undefined) {
    throw new GraphQLError('Forbidden')
  }
  if (limit == undefined && offset != undefined) {
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
              userId == undefined
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
            userId == undefined
              ? ''
              : `
            LEFT JOIN (
              SELECT theme_id, TRUE AS isLike, created_at
              FROM likes
              WHERE user_id = ?
            ) AS isLikes ON isLikes.theme_id = themes.id
          `
          }
          WHERE
            ${
              visibility == undefined
                ? userId == undefined
                  ? 'themes.visibility = "public"'
                  : 'themes.visibility IN ("public", "private")'
                : 'themes.visibility = ?'
            }
            ${type == undefined ? '' : `AND themes.type = ?`}
            ${
              only_like == undefined || !only_like
                ? ''
                : `AND isLikes.isLike = TRUE`
            }
            ${author == undefined ? '' : `AND themes.author_user_id = ?`}
          ORDER BY ${
            only_like === true
              ? 'isLikes.created_at DESC'
              : 'themes.created_at DESC'
          }
          ${limit == undefined ? '' : `LIMIT ?`}
          ${offset == undefined ? '' : `OFFSET ?`}
        `
    const [rows] = await connection.execute(sql, [
      ...(userId != undefined ? [userId] : []),
      ...(visibility != undefined ? [visibility] : []),
      ...(type != undefined ? [type] : []),
      ...(author != undefined ? [author] : []),
      ...(limit != undefined ? [limit] : []),
      ...(offset != undefined ? [offset] : []),
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
    if (err instanceof GraphQLError) {
      throw err
    }
    throw new GraphQLError(`Internal server error: ${err}`)
  }
}

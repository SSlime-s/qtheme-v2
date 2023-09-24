import { GraphQLError } from 'graphql'

import { connectDb } from '@/model/db'
import { assertIsArray, assertIsArrayObject } from '@/utils/typeUtils'

import type { ContextValue } from '.'
import type { QueryResolvers, Theme } from '@/apollo/generated/resolvers'

export const getThemes: QueryResolvers<ContextValue>['getThemes'] = async (
  _,
  args,
  { userId, connection, isSuper = false }
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
  const needCloseConnection = connection === undefined
  try {
    connection = connection ?? (await connectDb())
    const baseSql = `FROM themes
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
                ? isSuper
                  ? 'TRUE'
                  : userId == undefined
                  ? 'themes.visibility = "public"'
                  : author == undefined
                  ? 'themes.visibility IN ("public", "private")'
                  : '(themes.visibility IN ("public", "private") OR (themes.visibility = "draft" AND themes.author_user_id = ?))'
                : 'themes.visibility = ?'
            }
            ${type == undefined ? '' : `AND themes.type = ?`}
            ${
              only_like == undefined || !only_like
                ? ''
                : `AND isLikes.isLike = TRUE`
            }
            ${author == undefined ? '' : `AND themes.author_user_id = ?`}
    `
    const baseValues = [
      ...(userId != undefined ? [userId] : []),
      ...(visibility != undefined
        ? [visibility]
        : !isSuper && userId != undefined && author != undefined
        ? [userId]
        : []),
      ...(type != undefined ? [type] : []),
      ...(author != undefined ? [author] : []),
    ]
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
              userId == undefined
                ? 'FALSE'
                : 'CASE WHEN isLikes.isLike IS NULL THEN FALSE ELSE isLikes.isLike END'
            } AS isLike
          ${baseSql}
          ORDER BY ${
            only_like === true
              ? 'isLikes.created_at DESC'
              : 'themes.created_at DESC'
          }
          ${limit == undefined ? '' : `LIMIT ?`}
          ${offset == undefined ? '' : `OFFSET ?`}
        `
    const [rows] = await connection.execute(sql, [
      ...baseValues,
      ...(limit != undefined ? [limit] : []),
      ...(offset != undefined ? [offset] : []),
    ])
    assertIsArray(rows)
    const [count] = await connection.execute(
      `SELECT COUNT(*) AS count ${baseSql}`,
      baseValues
    )
    assertIsArrayObject(count)
    return {
      themes: rows as Theme[],
      total: count[0].count,
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

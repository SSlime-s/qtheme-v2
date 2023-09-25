import { print } from 'graphql'
import { unstable_serialize } from 'swr'

import { connectDb } from '@/model/db'

import { ThemeDocument } from '../graphql/getTheme.generated'
import { assertIsArray } from '../typeUtils'

import { themeFromRaw } from './hooks'

import type { FormattedTheme} from './hooks';
import type { Theme as ThemeRes } from '@/apollo/generated/graphql'
import type { Connection } from 'mysql2/promise'

/**
 * @warning 権限のチェックは行わない
 */
export const prefetchUseTheme = async (
  id: string
): Promise<Record<string, FormattedTheme>> => {
  let connection: Connection | undefined = undefined
  const key = unstable_serialize([print(ThemeDocument), { id }])

  try {
    connection = await connectDb()
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
        FALSE AS isLike
      FROM themes
      LEFT JOIN (
        SELECT COUNT(*) AS count, theme_id
        FROM likes
        GROUP BY theme_id
      ) AS likes ON likes.theme_id = themes.id
      WHERE themes.id = ?
    `
    const [rows] = await connection.execute(sql, [id])
    assertIsArray(rows)
    if (rows.length === 0) {
      return {}
    }

    const theme = rows[0] as ThemeRes

    const themeWhole = themeFromRaw(theme)

    return {
      [key]: themeWhole,
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * @warning 権限のチェックは行わない
 */
export const prefetchThemeIdList = async (): Promise<string[]> => {
  let connection: Connection | undefined = undefined
  try {
    connection = await connectDb()
    const sql = `
      SELECT id
      FROM themes
      ORDER BY created_at DESC
      LIMIT 1000
    `
    const [rows] = await connection.execute(sql)
    assertIsArray(rows)
    return (rows as { id: string }[]).map(row => row.id)
  } catch (e) {
    console.error(e)
    throw new Error(`Failed to prefetch theme id list: ${e}`)
  } finally {
    await connection?.end()
  }
}

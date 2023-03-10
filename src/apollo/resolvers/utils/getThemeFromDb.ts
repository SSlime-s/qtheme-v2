import { assertIsArrayObject } from '@/utils/typeUtils'
import { Connection } from 'mysql2/promise'

export const getThemeFromDb = async (
  connection: Connection,
  id: string,
  userId?: string,
) => {
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
  try {
    const [rows] = await connection.execute(sql, [
      ...(userId !== undefined ? [userId] : []),
      id,
    ])
    assertIsArrayObject(rows)
    if (rows.length === 0) {
      return null
    }
    return rows[0] as {
      id: string
      title: string
      description: string
      author: string
      visibility: 'public' | 'private' | 'draft'
      type: 'light' | 'dark'
      createdAt: string
      theme: string
      likes: number
      isLike: boolean
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
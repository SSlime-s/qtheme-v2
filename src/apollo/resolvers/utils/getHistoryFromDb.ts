import { assertIsArrayObject } from '@/utils/typeUtils'
import { Connection } from 'mysql2/promise'

/**
 * **WARNING**: この関数では閲覧権限の確認は行わない
 */
export const getHistoryFromDb = async (connection: Connection, id: string) => {
  const sql = `
    SELECT
      id,
      theme_id AS themeId,
      version,
      theme,
      created_at AS createdAt
    FROM theme_versions
    WHERE theme_id = ?
  `
  try {
    const [rows] = await connection.execute(sql, [id])
    assertIsArrayObject(rows)
    return rows as {
      id: string
      themeId: string
      version: string
      theme: string
      createdAt: string
    }[]
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * **WARNING**: この関数では閲覧権限の確認は行わない
 */
export const getLatestHistoryFromDb = async (
  connection: Connection,
  id: string
) => {
  const sql = `
    SELECT
      id,
      theme_id AS themeId,
      version,
      theme,
      created_at AS createdAt
    FROM theme_versions
    WHERE theme_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `
  try {
    const [rows] = await connection.execute(sql, [id])
    assertIsArrayObject(rows)
    if (rows.length === 0) {
      return null
    }
    return rows[0] as {
      id: string
      themeId: string
      version: string
      theme: string
      createdAt: string
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

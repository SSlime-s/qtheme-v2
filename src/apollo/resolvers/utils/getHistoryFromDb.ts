import type { Connection, RowDataPacket } from 'mysql2/promise'

interface IHistory extends RowDataPacket {
  id: string
  themeId: string
  version: string
  theme: string
  createdAt: Date
}

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
    ORDER BY created_at DESC
  `
  try {
    const [rows] = await connection.execute<IHistory[]>(sql, [id])
    return rows
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
    const [rows] = await connection.execute<IHistory[]>(sql, [id])
    if (rows.length === 0) {
      return null
    }
    return rows[0]
  } catch (error) {
    console.error(error)
    throw error
  }
}

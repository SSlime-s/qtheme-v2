import { GraphQLError } from 'graphql'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'
import { Connection } from 'mysql2/promise'
import { ulid } from 'ulid'
import { MutationResolvers, Theme } from '@/apollo/generated/resolvers'
import { getThemeFromDb } from './utils/getThemeFromDb'
import { getLatestHistoryFromDb } from './utils/getHistoryFromDb'
import { bumpVersion } from './utils/bumpVersion'

export const updateTheme: MutationResolvers<ContextValue>['updateTheme'] =
  async (_, args, { userId }) => {
    if (userId === undefined) {
      throw new GraphQLError('Forbidden')
    }
    const { id, title, description, visibility, type, theme } = args
    let connection: Connection | undefined
    try {
      connection = await connectDb()
      await connection.beginTransaction()
      const oldTheme = await getThemeFromDb(connection, id, userId)
      if (oldTheme === null) {
        throw new GraphQLError('Not found')
      }
      if (oldTheme.author !== userId) {
        throw new GraphQLError('Forbidden')
      }
      const sql = `
      UPDATE themes
      SET
        title = ?,
        description = ?,
        visibility = ?,
        type = ?,
        theme = ?
      WHERE id = ?
        ${/* 念のため author_user_id も確認 */ ''}
        AND author_user_id = ?
    `
      await connection.execute(sql, [
        title,
        description,
        visibility,
        type,
        theme,
        id,
        userId,
      ])
      if (theme !== oldTheme.theme) {
        const latestVersion = await getLatestHistoryFromDb(connection, id)
        if (latestVersion === null) {
          throw new GraphQLError('Internal server error')
        }
        const newVersion = bumpVersion(latestVersion.version)
        if (newVersion === null) {
          throw new GraphQLError('Internal server error')
        }
        const version_id = ulid()
        const sql = `
          INSERT INTO theme_versions (
            id,
            theme_id,
            version,
            theme
          ) VALUES (
            ?, ?, ?, ?
          )
        `
        await connection.execute(sql, [version_id, id, newVersion, theme])
      }
      await connection.commit()

      return {
        ...(oldTheme as Theme),
        title,
        description,
        visibility,
        type,
        theme,
      }
    } catch (err: unknown) {
      await connection?.rollback()
      console.error(err)
      if (err instanceof GraphQLError) {
        throw err
      }
      throw new GraphQLError(`Internal server error: ${err}`)
    } finally {
      await connection?.end()
    }
  }

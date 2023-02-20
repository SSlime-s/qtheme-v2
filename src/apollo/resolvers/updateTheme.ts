import { GraphQLError } from 'graphql'
import { assertIsObject } from '@/lib/typeUtils'
import { connectDb } from '@/model/db'
import { ContextValue } from '.'
import { getTheme } from './getTheme'
import { Connection } from 'mysql2/promise'
import { ulid } from 'ulid'
import { z } from 'zod'
import { MutationResolvers, Theme } from '@/apollo/generated/resolvers'

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
      // @ts-expect-error: 実装上は呼び出し可能
      const old = await getTheme(_, { id }, { userId, connection })
      if (old === null) {
        throw new GraphQLError('Not found')
      }
      const oldTheme = old.theme
      assertIsObject(oldTheme)
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
        await connection.execute(sql, [
          version_id,
          id,
          z.string().parse(oldTheme.version) + 1,
          theme,
        ])
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

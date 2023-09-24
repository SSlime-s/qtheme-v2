import { GraphQLError } from 'graphql'
import { ulid } from 'ulid'

import { connectDb } from '@/model/db'
import { assertIsArrayObject } from '@/utils/typeUtils'

import { bumpVersion } from './utils/bumpVersion'
import { publishThemeWebhook } from './utils/sendTraqWebhook'

import type { ContextValue } from '.'
import type { MutationResolvers } from '@/apollo/generated/resolvers'
import type { Connection } from 'mysql2/promise'

export const createTheme: MutationResolvers<ContextValue>['createTheme'] =
  async (_, args, { userId, revalidate }) => {
    if (userId === undefined) {
      throw new GraphQLError('Forbidden')
    }
    const { title, description, visibility, type, theme } = args
    const id = ulid()
    let connection: Connection | undefined
    try {
      connection = await connectDb()
      await connection.beginTransaction()
      const sql = `
          INSERT INTO themes (
            id,
            title,
            description,
            author_user_id,
            visibility,
            type,
            theme
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
          )
        `
      await connection.execute(sql, [
        id,
        title,
        description,
        userId,
        visibility,
        type,
        theme,
      ])
      // version にも入れる
      {
        const version_id = ulid()
        const version = bumpVersion()
        if (version === null) {
          throw new GraphQLError('Internal server error')
        }

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
        await connection.execute(sql, [version_id, id, version, theme])
      }
      await connection.commit()
      const sql2 = `
        SELECT
          created_at
        FROM themes
        WHERE id = ?
      `
      const [rows] = await connection.execute(sql2, [id])
      assertIsArrayObject(rows)
      if (rows.length === 0) {
        throw new GraphQLError('Internal server error')
      }
      const { created_at } = rows[0]

      if (visibility !== 'draft') {
        await publishThemeWebhook({
          author: userId,
          themeId: id,
          title,
        }).catch((err: unknown) => {
          console.error(err)
        })
      }

      await revalidate?.(`/theme/${id}`)

      return {
        id,
        ...args,
        author: userId,
        createdAt: created_at,
        likes: 0,
        isLike: false,
      }
    } catch (err: unknown) {
      console.error(err)
      await connection?.rollback()
      if (err instanceof GraphQLError) {
        throw err
      }
      throw new GraphQLError(`Internal server error: ${err}`)
    } finally {
      await connection?.end()
    }
  }

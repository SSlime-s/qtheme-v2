import { Prisma } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { P, match } from 'ts-pattern'

import type { ContextValue } from '.'
import type {
  QueryResolvers,
  Theme,
  Type,
  Visibility,
} from '@/apollo/generated/resolvers'
import type { Sql } from '@prisma/client/runtime/library'

export const getThemes: QueryResolvers<ContextValue>['getThemes'] = async (
  _,
  args,
  { userId, prisma }
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
    const visibilityCondition = match([
      visibility == undefined,
      userId == undefined,
      author == undefined,
    ])
      .returnType<Sql>()
      .with([false, P._, P._], () => Prisma.sql`visibility = ${visibility}`)
      .with([true, true, P._], () => Prisma.sql`visibility = "public"`)
      .with(
        [true, false, true],
        () => Prisma.sql`visibility IN ("public", "private")`
      )
      .with(
        [true, false, false],
        () =>
          Prisma.sql`visibility IN ("public", "private")
          OR
            (themes.visibility = "draft"
            AND themes.author_user_id = ${userId})`
      )
      .exhaustive()
    const tableWhereStatement = Prisma.sql`
        FROM themes
        LEFT JOIN (
          SELECT COUNT(*) AS count, theme_id
          FROM likes
          GROUP BY theme_id
        ) AS likes ON likes.theme_id = themes.id
        ${
          userId == undefined
            ? Prisma.empty
            : Prisma.sql`
          LEFT JOIN (
            SELECT theme_id, TRUE AS is_like, created_at
            FROM likes
            WHERE user_id = ${userId}
          ) AS is_like ON is_like.theme_id = themes.id
        `
        }
        WHERE ${visibilityCondition}
              ${
                type == undefined
                  ? Prisma.empty
                  : Prisma.sql`AND type = ${type}`
              }
              ${
                only_like === true
                  ? Prisma.sql`AND is_like = TRUE`
                  : Prisma.empty
              }
              ${
                author == undefined
                  ? Prisma.empty
                  : Prisma.sql`AND author_user_id = ${author}`
              }
    `
    const sql = Prisma.sql`
      SELECT
        themes.id,
        themes.title,
        themes.description,
        themes.author_user_id,
        themes.visibility,
        themes.type,
        themes.created_at,
        themes.theme,
        CASE WHEN likes.count IS NULL THEN 0 ELSE likes.count END AS likes,
        ${
          userId == undefined
            ? Prisma.sql`FALSE`
            : Prisma.sql`CASE WHEN is_like.is_like = TRUE THEN TRUE ELSE FALSE END`
        } AS is_like
        ${tableWhereStatement}
        ORDER BY ${
          only_like === true
            ? Prisma.sql`is_like.created_at DESC`
            : Prisma.sql`themes.created_at DESC`
        }
        ${limit == undefined ? Prisma.empty : Prisma.sql`LIMIT ${limit}`}
        ${offset == undefined ? Prisma.empty : Prisma.sql`OFFSET ${offset}`}
    `

    type Themes = {
      id: string
      title: string
      description: string
      author_user_id: string
      visibility: string
      type: string
      created_at: Date
      theme: string
      likes: bigint
      is_like: boolean
    }[]
    const themes = await prisma.$queryRaw<Themes>(sql)
    type Count = { count: bigint }[]
    const [{ count }] = await prisma.$queryRaw<Count>`
      SELECT COUNT(*) AS count ${tableWhereStatement}
    `

    return {
      themes: themes.map(theme => {
        const {
          created_at,
          author_user_id,
          is_like,
          type,
          visibility,
          likes,
          ...themeRest
        } = theme

        return {
          ...themeRest,
          createdAt: created_at,
          author: author_user_id,
          isLike: is_like,
          likes: Number(likes),
          type: (type ?? 'other') as Type,
          visibility: visibility as Visibility,
        }
      }) satisfies Theme[],
      total: Number(count),
    }
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof GraphQLError) {
      throw err
    }
    throw new GraphQLError(`Internal server error: ${err}`)
  }
}

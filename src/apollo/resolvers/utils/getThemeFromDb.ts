import { Prisma } from '@prisma/client'

import type { Theme, Type, Visibility } from '@/apollo/generated/resolvers'
import type { PrismaClient } from '@prisma/client'

export const getThemeFromDb = async (
  prisma: Pick<PrismaClient, '$queryRaw'>,
  id: string,
  userId?: string
) => {
  try {
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
        userId === undefined
          ? Prisma.sql`FALSE`
          : Prisma.sql`CASE WHEN is_like.is_like = TRUE THEN TRUE ELSE FALSE END`
      } AS is_like
    FROM themes
    LEFT JOIN (
      SELECT COUNT(*) AS count, theme_id
      FROM likes
      GROUP BY theme_id
    ) AS likes ON likes.theme_id = themes.id
    ${
      userId === undefined
        ? Prisma.empty
        : Prisma.sql`
    LEFT JOIN (
      SELECT theme_id, TRUE AS is_like
      FROM likes
      WHERE user_id = ${userId}
    ) AS is_like ON is_like.theme_id = themes.id`
    }
    WHERE themes.id = ${id} AND ${
      userId === undefined
        ? Prisma.sql`visibility = 'public'`
        : Prisma.sql`(
        visibility IN ('public', 'private')
          OR (
            visibility = 'draft'
            AND author_user_id = ${userId}
          )
      )`
    }
    `

    type Themes = {
      id: string
      title: string
      description: string
      author_user_id: string
      visibility: string
      type: string | null
      created_at: Date
      theme: string
      likes: bigint
      is_like: boolean
    }[]
    const theme = await prisma.$queryRaw<Themes>(sql)

    if (theme.length === 0) {
      return null
    }

    const {
      author_user_id,
      type,
      visibility,
      created_at,
      is_like,
      likes,
      ...restTheme
    } = theme[0]

    return {
      ...restTheme,
      author: author_user_id,
      type: (type ?? 'other') as Type,
      visibility: visibility as Visibility,
      createdAt: created_at,
      isLike: is_like,
      likes: Number(likes),
    } satisfies Theme
  } catch (err: unknown) {
    console.error(err)
    throw err
  }
}

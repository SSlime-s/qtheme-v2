import { GraphQLError } from 'graphql'
import { P, match } from 'ts-pattern'

import type { ContextValue } from '.'
import type {
  QueryResolvers,
  Type,
  Visibility,
} from '@/apollo/generated/resolvers'
import type { Prisma } from '@prisma/client'

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
      .returnType<Prisma.themesWhereInput>()
      .with([false, P._, P._], () => ({
        visibility: visibility ?? undefined,
      }))
      .with([true, true, P._], () => ({
        visibility: 'public',
      }))
      .with([true, false, true], () => ({
        visibility: {
          in: ['public', 'private'],
        },
      }))
      .with([true, false, false], () => ({
        OR: [
          {
            visibility: {
              in: ['public', 'private'],
            },
          },
          {
            visibility: 'draft',
            author_user_id: userId,
          },
        ],
      }))
      .exhaustive()
    const mergedThemeCondition: Prisma.themesWhereInput = {
      ...visibilityCondition,
      type: type ?? undefined,
      author_user_id: author ?? undefined,
    }
    if (only_like === true) {
      const themes = await prisma.likes.findMany({
        select: {
          themes: {
            select: {
              id: true,
              title: true,
              description: true,
              author_user_id: true,
              visibility: true,
              type: true,
              created_at: true,
              theme: true,
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          },
        },
        where: {
          user_id: userId,
          themes: mergedThemeCondition,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limit ?? undefined,
        skip: offset ?? undefined,
      })
      const total = await prisma.likes.count({
        where: {
          user_id: userId,
          themes: mergedThemeCondition,
        },
      })

      return {
        themes: themes.map(({ themes }) => {
          const {
            id,
            title,
            description,
            author_user_id,
            visibility,
            type,
            created_at,
            theme,
            _count: { likes },
          } = themes

          return {
            id,
            title,
            description,
            author: author_user_id,
            visibility: visibility as Visibility,
            type: (type ?? 'other') as Type,
            createdAt: created_at,
            theme: theme,
            likes,
            isLike: true,
          }
        }),
        total,
      }
    } else {
      const themes = await prisma.themes.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          author_user_id: true,
          visibility: true,
          type: true,
          created_at: true,
          theme: true,
          _count: {
            select: {
              likes: true,
            },
          },
          likes: {
            select: {
              theme_id: true,
            },
            where: {
              user_id: userId,
            },
          },
        },
        where: mergedThemeCondition,
        orderBy: {
          created_at: 'desc',
        },
        take: limit ?? undefined,
        skip: offset ?? undefined,
      })
      const total = await prisma.themes.count({
        where: mergedThemeCondition,
      })

      return {
        themes: themes.map(theme => {
          const {
            id,
            title,
            description,
            author_user_id,
            visibility,
            type,
            created_at,
            theme: theme_,
            _count: { likes },
            likes: likes_,
          } = theme

          return {
            id,
            title,
            description,
            author: author_user_id,
            visibility: visibility as Visibility,
            type: (type ?? 'other') as Type,
            createdAt: created_at,
            theme: theme_,
            likes,
            isLike: likes_.length === 1,
          }
        }),
        total,
      }
    }
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof GraphQLError) {
      throw err
    }
    throw new GraphQLError(`Internal server error: ${err}`)
  }
}

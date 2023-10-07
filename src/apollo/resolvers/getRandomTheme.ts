import { GraphQLError } from 'graphql'

import type { ContextValue } from '.'
import type {
  QueryResolvers,
  Theme,
  Type,
  Visibility,
} from '@/apollo/generated/resolvers'
import type { Prisma } from '@prisma/client'

export const getRandomTheme: QueryResolvers<ContextValue>['getRandomTheme'] =
  async (_parent, args, { userId, prisma }) => {
    const { visibility } = args
    if (visibility === 'draft') {
      throw new GraphQLError('Invalid visibility')
    }
    if (visibility === 'private' && userId === undefined) {
      throw new GraphQLError('Forbidden')
    }

    try {
      if (userId === undefined) {
        const theme = await prisma.$transaction(async prisma => {
          const { type } = args

          const where: Prisma.themesWhereInput = {
            visibility: 'public',
            type: type ?? undefined,
          }

          const themeCount = await prisma.themes.count({
            where,
          })
          const random = Math.floor(Math.random() * themeCount)
          const theme = await prisma.themes.findFirst({
            include: {
              _count: {
                select: { likes: true },
              },
            },
            where,
            skip: random,
          })
          return theme
        })

        if (theme === null) {
          throw new GraphQLError('Not found')
        }

        const {
          _count: { likes },
          created_at: createdAt,
          author_user_id: author,
          type: type_,
          visibility,
          ...themeRest
        } = theme

        return {
          ...themeRest,
          likes,
          createdAt,
          author,
          type: (type_ ?? 'other') as Type,
          visibility: visibility as Visibility,
          isLike: false,
        } satisfies Theme
      } else {
        const theme = await prisma.$transaction(async prisma => {
          // HACK: 外側の visibility を参照しようとすると何故か ReferenceError: before initialization が発生する
          //       そのため定義し直す
          const { visibility, type } = args
          const where: Prisma.themesWhereInput = {
            visibility:
              visibility === undefined || visibility === null
                ? {
                    in: ['public', 'private'],
                  }
                : visibility,
            type: type ?? undefined,
          }

          const themeCount = await prisma.themes.count({
            where,
          })
          const random = Math.floor(Math.random() * themeCount)
          const theme = await prisma.themes.findFirst({
            include: {
              _count: {
                select: { likes: true },
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
            where,
            skip: random,
          })
          return theme
        })
        if (theme === null) {
          throw new GraphQLError('Not found')
        }

        const {
          _count: { likes },
          created_at: createdAt,
          author_user_id: author,
          type: type_,
          visibility,
          likes: likes_,
          ...themeRest
        } = theme

        return {
          ...themeRest,
          likes,
          createdAt,
          author,
          type: (type_ ?? 'other') as Type,
          visibility: visibility as Visibility,
          isLike: likes_.length !== 0,
        } satisfies Theme
      }
    } catch (err: unknown) {
      console.error(err)
      if (err instanceof GraphQLError) {
        throw err
      }
      throw new GraphQLError(`Internal server error: ${err}`)
    }
  }

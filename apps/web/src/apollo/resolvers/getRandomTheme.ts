import { GraphQLError } from 'graphql'
import { P, match } from 'ts-pattern'

import type { ContextValue } from '.'
import type {
  QueryResolvers,
  Theme,
  Type,
  Visibility,
} from '@/apollo/generated/resolvers'
import type { Prisma } from '@/model/generated/prisma-client'

export const getRandomTheme: QueryResolvers<ContextValue>['getRandomTheme'] =
  async (_parent, args, { userId, prisma }) => {
    const { visibility, type } = args
    if (visibility === 'draft') {
      throw new GraphQLError('Invalid visibility')
    }
    if (visibility === 'private' && userId === undefined) {
      throw new GraphQLError('Forbidden')
    }

    try {
      const visibilityCondition = match([
        userId === undefined,
        visibility === undefined || visibility === null,
      ])
        .returnType<Prisma.themesWhereInput>()
        .with([true, P._], () => ({
          visibility: 'public',
        }))
        .with([false, true], () => ({
          visibility: {
            in: ['public', 'private'],
          },
        }))
        .with([false, false], () => ({
          visibility: visibility!,
        }))
        .exhaustive()

      const theme = await prisma.$transaction(async prisma => {
        const where: Prisma.themesWhereInput = {
          ...visibilityCondition,
          type: type ?? undefined,
        }

        const themeCount = await prisma.themes.count({
          where,
        })
        const random = Math.floor(Math.random() * themeCount)
        const theme = await prisma.themes.findFirst({
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
          where,
          skip: random,
        })
        return theme
      })
      if (theme === null) {
        throw new GraphQLError('Not found')
      }

      const getIsLike = async (userId: string): Promise<boolean> => {
        const like = await prisma.likes.findFirst({
          select: {
            theme_id: true,
          },
          where: {
            user_id: userId,
            theme_id: theme.id,
          },
        })
        return like !== null
      }

      const is_like = userId === undefined ? false : await getIsLike(userId)

      const {
        _count: { likes },
        created_at: createdAt,
        author_user_id: author,
        type: type_,
        visibility: visibility_,
        ...themeRest
      } = theme

      return {
        ...themeRest,
        likes,
        createdAt,
        author,
        type: (type_ ?? 'other') as Type,
        visibility: visibility_ as Visibility,
        isLike: is_like,
      } satisfies Theme
    } catch (err: unknown) {
      console.error(err)
      if (err instanceof GraphQLError) {
        throw err
      }
      throw new GraphQLError(`Internal server error: ${err}`)
    }
  }

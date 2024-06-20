import type { Theme, Type, Visibility } from '@/apollo/generated/resolvers'
import type { Prisma, PrismaClient } from '@repo/database'

export const getThemeFromDb = async (
  prisma: Pick<PrismaClient, 'themes' | 'likes'>,
  id: string,
  userId?: string
) => {
  try {
    const visibilityCondition: Prisma.themesWhereInput =
      userId === undefined
        ? {
            visibility: 'public',
          }
        : {
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
          }

    const theme = await prisma.themes.findUnique({
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
      where: {
        ...visibilityCondition,
        id,
      },
    })

    if (theme === null) {
      return null
    }

    const getIsLike = async (userId: string): Promise<boolean> => {
      const like = await prisma.likes.findFirst({
        select: {
          theme_id: true,
        },
        where: {
          user_id: userId,
          theme_id: id,
        },
      })

      return like !== null
    }

    const is_like = userId === undefined ? false : await getIsLike(userId)

    const {
      author_user_id,
      type,
      visibility,
      created_at,
      _count: { likes },
      ...restTheme
    } = theme

    return {
      ...restTheme,
      author: author_user_id,
      type: (type ?? 'other') as Type,
      visibility: visibility as Visibility,
      createdAt: created_at,
      isLike: is_like,
      likes,
    } satisfies Theme
  } catch (err: unknown) {
    console.error(err)
    throw err
  }
}

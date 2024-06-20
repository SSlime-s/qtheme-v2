import dayjs from 'dayjs'
import { print } from 'graphql'
import { unstable_serialize } from 'swr'

import { themeSchema } from '@/model/theme'

import { ThemeDocument } from '../graphql/getTheme.generated'

import type { FormattedTheme } from './hooks'
import type { Type, Visibility } from '@/apollo/generated/graphql'
import type { PrismaClient } from '@repo/database'

/**
 * @warning 権限のチェックは行わない
 */
export const prefetchUseTheme = async (
  prisma: PrismaClient,
  id: string
): Promise<Record<string, FormattedTheme>> => {
  const key = unstable_serialize([print(ThemeDocument), { id }])

  try {
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
        id,
      },
    })
    if (theme === null) {
      return {}
    }

    const {
      _count: { likes },
      created_at: createdAt,
      author_user_id: author,
      type,
      visibility,
      ...themeRest
    } = theme

    const themeWhole = {
      ...themeRest,
      author,
      likes,
      isLike: false,
      theme: themeSchema.parse(JSON.parse(themeRest.theme)),
      // おそらく lowercase で帰ってくるが、念のため toLowerCase する
      type: (type ?? 'other').toLowerCase() as Lowercase<Type>,
      visibility: visibility.toLowerCase() as Lowercase<Visibility>,
      createdAt: dayjs(createdAt).format('YYYY/MM/DD'),
    } satisfies FormattedTheme

    return {
      [key]: themeWhole,
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * @warning 権限のチェックは行わない
 */
export const prefetchThemeIdList = async (
  prisma: PrismaClient
): Promise<string[]> => {
  try {
    const themes = await prisma.themes.findMany({
      select: {
        id: true,
      },
      take: 1000,
      orderBy: {
        created_at: 'desc',
      },
    })
    return themes.map(theme => theme.id)
  } catch (e) {
    console.error(e)
    throw new Error(`Failed to prefetch theme id list: ${e}`)
  }
}

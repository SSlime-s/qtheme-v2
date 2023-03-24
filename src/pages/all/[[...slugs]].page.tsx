import { Layout } from '@/components/layout'
import { PreviewCard } from '@/components/PreviewCard'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { useCurrentTheme, useThemeList } from '@/utils/theme/hooks'
import { assertIsArray } from '@/utils/typeUtils'
import styled from '@emotion/styled'
import { GetServerSidePropsContext } from 'next'
import { NextPageWithLayout } from '@/pages/_app.page'
import Head from 'next/head'
import { useCallback, useMemo } from 'react'
import { pageTitle } from '@/utils/title'
import { useToast } from '@/utils/toast'

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const userId = extractShowcaseUser(req)

  const { slugs } = query
  let filter: 'all' | 'light' | 'dark' | 'invalid'
  if (slugs === undefined || slugs.length === 0) {
    filter = 'all'
  } else if (slugs.length === 1) {
    assertIsArray(slugs)
    if (['light', 'dark'].includes(slugs[0].toLowerCase())) {
      filter = slugs[0].toLowerCase() as 'light' | 'dark'
    } else {
      filter = 'invalid'
    }
  } else {
    filter = 'invalid'
  }

  if (filter === 'invalid') {
    return {
      redirect: {
        destination: '/all',
        permanent: false,
      },
    }
  }

  return {
    props: {
      userId: userId ?? null,
      filter,
    },
  }
}
type Props = NonNullable<
  Awaited<ReturnType<typeof getServerSideProps>>['props']
>

const AllPage: NextPageWithLayout<Props> = ({ userId, filter }) => {
  useSetUserId(userId)

  const {
    themes,
    total,
    mutate: { loadMore, toggleLike },
  } = useThemeList(filter === 'all' ? null : filter, null)
  const {
    mutate: { changeTheme },
  } = useCurrentTheme()
  const { addToast } = useToast()

  const toggleLikeWithAuth = useCallback(
    (id: string, isLike: boolean) => {
      if (userId === null) {
        addToast({
          content: <>favorite は部員限定です</>,
          type: 'error',
        })
        return
      }
      void toggleLike(id, isLike)
    },
    [addToast, toggleLike, userId]
  )

  // TODO: そのうち消す テスト用
  const ogUrl = useMemo(() => {
    const url = new URL('http://localhost:3000/api/og')
    url.searchParams.set(
      'theme',
      JSON.stringify(themes[0]?.theme ?? '01GPX823XG885ZENT9QD6E76EQ')
    )
    url.searchParams.set('author', themes[0]?.author)
    return url.toString()
  }, [themes])

  const title = useMemo(() => {
    if (filter === 'all') {
      return '#all'
    } else {
      return `#all/${filter}`
    }
  }, [filter])

  return (
    <>
      <Head>
        <title>{pageTitle(title)}</title>
        <meta name='description' content='all themes' />
        <meta name='og:title' content='all themes' />
        <meta name='og:description' content='all themes' />
        <meta name='og:image' content={ogUrl} />
      </Head>
      <Wrap>
        {themes.map(theme => {
          return (
            <PreviewCard
              key={theme.id}
              themeInfo={theme}
              onFavorite={toggleLikeWithAuth}
              changeTheme={changeTheme}
            />
          )
        })}
      </Wrap>
    </>
  )
}
export default AllPage
AllPage.getLayout = page => {
  return <Layout>{page}</Layout>
}

const Wrap = styled.div`
  /* TODO: grid でいい感じに並べる */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 16px;
  padding: 32px;
  justify-items: center;
`

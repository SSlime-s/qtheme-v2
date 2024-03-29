import styled from '@emotion/styled'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'

import { Error } from '@/components/Error'
import { InfiniteLoad } from '@/components/InfiniteLoad'
import { LoadingBar } from '@/components/LoadingBar'
import { PreviewCard } from '@/components/PreviewCard'
import { SEO } from '@/components/SEO'
import { Layout } from '@/components/layout'
import { useSetTopic } from '@/components/layout/Header'
import { extractShowcaseUser } from '@/utils/extractUser'
import { useCurrentTheme, useThemeList } from '@/utils/theme/hooks'
import { pageTitle } from '@/utils/title'
import { useToast } from '@/utils/toast'
import { assertIsArray } from '@/utils/typeUtils'
import { useSetUserId } from '@/utils/userId'

import type { NextPageWithLayout } from '@/pages/_app.page'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps = (async ({ req, query }) => {
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
}) satisfies GetServerSideProps

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const AllPage: NextPageWithLayout<Props> = ({ userId, filter }) => {
  useSetUserId(userId)

  const {
    themes,
    total,
    isLoading,
    error,
    isReachingEnd,
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

  const title = useMemo(() => {
    if (filter === 'all') {
      return '#all'
    } else {
      return `#all/${filter}`
    }
  }, [filter])
  const url = useMemo(() => {
    if (filter === 'all') {
      return '/all'
    } else {
      return `/all/${filter}`
    }
  }, [filter])

  const Heads = useCallback(() => {
    return (
      <>
        <Head>
          <title>{pageTitle(title)}</title>
        </Head>
        <SEO url={url} title={title} description='all themes' />
      </>
    )
  }, [title, url])

  const setTopic = useSetTopic()
  useEffect(() => {
    setTopic(`${total} themes`)

    return () => {
      setTopic(null)
    }
  }, [total, setTopic])

  if (isLoading) {
    return (
      <>
        <Heads />
        <LoadingBar />
      </>
    )
  }

  if (error !== undefined) {
    return <Error statusCode={500} />
  }

  return (
    <>
      <Heads />
      <Wrap>
        <Grid>
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
        </Grid>
        <InfiniteLoad
          loadMore={loadMore}
          isReachingEnd={isReachingEnd ?? true}
        />
      </Wrap>
    </>
  )
}
export default AllPage
AllPage.getLayout = page => {
  return <Layout>{page}</Layout>
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const Grid = styled.div`
  /* TODO: grid でいい感じに並べる */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 16px;
  padding: 32px;
  justify-items: center;
  width: 100%;
`

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
import {
  prefetchUseThemeList,
  useCurrentTheme,
  useThemeList,
} from '@/utils/theme/hooks'
import { pageTitle } from '@/utils/title'
import { assertIsArray } from '@/utils/typeUtils'
import { useWithAuth } from '@/utils/useWithAuth'
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

  const initialData = await prefetchUseThemeList(
    filter === 'all' ? null : filter,
    null
  )

  return {
    props: {
      userId: userId ?? null,
      filter,
      initialData,
    },
  }
}) satisfies GetServerSideProps

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const AllPage: NextPageWithLayout<Props> = ({
  userId,
  filter,
  initialData,
}) => {
  useSetUserId(userId)

  const {
    themes,
    total,
    isLoading,
    error,
    isReachingEnd,
    mutate: { loadMore, toggleLike },
  } = useThemeList(
    filter === 'all' ? null : filter,
    null,
    undefined,
    initialData
  )
  const {
    mutate: { changeTheme },
  } = useCurrentTheme()

  const toggleLikeWithAuth = useWithAuth(
    userId,
    toggleLike,
    'favorite は部員限定です'
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

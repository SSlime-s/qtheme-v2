import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { GetServerSidePropsContext } from 'next'
import { NextPageWithLayout } from '@/pages/_app.page'
import { Layout } from '@/components/layout'
import { assertIsArray } from '@/utils/typeUtils'
import { useCurrentTheme } from '@/utils/theme/hooks'
import { useEffect, useMemo } from 'react'
import Head from 'next/head'
import { pageTitle } from '@/utils/title'
import { PreviewCard } from '@/components/PreviewCard'
import styled from '@emotion/styled'
import { useFavoritesList } from './hook'
import { InfiniteLoad } from '@/components/InfiniteLoad'
import { useSetTopic } from '@/components/layout/Header'
import { Error } from '@/components/Error'
import { LoadingBar } from '@/components/LoadingBar'

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

const FavoritePage: NextPageWithLayout<Props> = ({ userId, filter }) => {
  useSetUserId(userId)

  const title = useMemo(() => {
    if (filter === 'all') {
      return '#favorite'
    } else {
      return `#favorite/${filter}`
    }
  }, [filter])

  if (userId === null) {
    return (
      <>
        <Head>
          <title>{pageTitle(title)}</title>
        </Head>
        <Error statusCode={401} />
      </>
    )
  }
  return (
    <>
      <Head>
        <title>{pageTitle(title)}</title>
      </Head>
      <FavoritePageContent userId={userId} filter={filter} />
    </>
  )
}
FavoritePage.getLayout = page => <Layout>{page}</Layout>
export default FavoritePage

const FavoritePageContent: React.FC<
  Props & {
    userId: NonNullable<Props['userId']>
  }
> = ({ userId, filter }) => {
  useSetUserId(userId)

  const {
    themes,
    total,
    error,
    isLoading,
    isReachingEnd,
    mutate: { loadMore, toggleLike },
  } = useFavoritesList(filter === 'all' ? null : filter, null)
  const {
    mutate: { changeTheme },
  } = useCurrentTheme()

  const setTopic = useSetTopic()
  useEffect(() => {
    setTopic(`${total} themes`)

    return () => {
      setTopic(null)
    }
  }, [total, setTopic])

  if (isLoading) {
    return <LoadingBar />
  }

  if (error !== undefined) {
    return <Error statusCode={500} />
  }

  return (
    <>
      <Wrap>
        <Grid>
          {themes.map(theme => {
            return (
              <PreviewCard
                key={theme.id}
                themeInfo={theme}
                onFavorite={toggleLike}
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

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 16px;
  padding: 32px;
  justify-items: center;
  width: 100%;
`

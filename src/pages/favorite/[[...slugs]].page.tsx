import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { GetServerSidePropsContext } from 'next'
import { NextPageWithLayout } from '@/pages/_app.page'
import { Layout } from '@/components/layout'
import Error from 'next/error'
import { assertIsArray } from '@/utils/typeUtils'
import { useCurrentTheme } from '@/utils/theme/hooks'
import { useMemo } from 'react'
import Head from 'next/head'
import { pageTitle } from '@/utils/title'
import { PreviewCard } from '@/components/PreviewCard'
import styled from '@emotion/styled'
import { useFavoritesList } from './hook'

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
  const {
    themes,
    total,
    mutate: { loadMore, toggleLike },
  } = useFavoritesList(filter === 'all' ? null : filter, null)
  const {
    mutate: { changeTheme },
  } = useCurrentTheme()

  return (
    <>
      <Wrap>
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
      </Wrap>
    </>
  )
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 16px;
  padding: 32px;
  justify-items: center;
`

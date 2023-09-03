import styled from '@emotion/styled'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Error } from '@/components/Error'
import { InfiniteLoad } from '@/components/InfiniteLoad'
import { LoadingBar } from '@/components/LoadingBar'
import { FullWidthContent, Message } from '@/components/Message'
import { PreviewCard } from '@/components/PreviewCard'
import { SEO } from '@/components/SEO'
import { Layout } from '@/components/layout'
import { useSetTopic } from '@/components/layout/Header'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { useCurrentTheme } from '@/utils/theme/hooks'
import { pageTitle } from '@/utils/title'

import { useAuthorThemes } from './hooks'

import type { NextPageWithLayout } from '../_app.page'
import type { GetServerSidePropsContext } from 'next'

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const userId = extractShowcaseUser(req)

  return {
    props: {
      userId: userId ?? null,
    },
  }
}

type Props = NonNullable<
  Awaited<ReturnType<typeof getServerSideProps>>['props']
>
const UserPage: NextPageWithLayout<Props> = ({ userId }) => {
  useSetUserId(userId)

  const { id } = useRouter().query as { id: string }
  const {
    themes,
    total,
    isReachingEnd,
    error,
    isLoading,
    mutate: { loadMore, toggleLike },
  } = useAuthorThemes(id, null)
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
      <Head>
        <title>{pageTitle(`#user/${id}`)}</title>
      </Head>
      <SEO
        url={`/user/${id}`}
        title={`#user/${id}`}
        description={`${total} themes`}
      />
      <Wrap>
        <Message
          iconUser={id}
          name={id}
          date=''
          tag=''
          content={
            <>
              <p>{total} 投稿</p>
              <FullWidthContent>
                <ContentWrap>
                  {themes.map(theme => (
                    <PreviewCard
                      key={theme.id}
                      themeInfo={theme}
                      onFavorite={toggleLike}
                      changeTheme={changeTheme}
                    />
                  ))}
                </ContentWrap>
                <InfiniteLoad
                  loadMore={loadMore}
                  isReachingEnd={isReachingEnd ?? true}
                />
              </FullWidthContent>
            </>
          }
          nonHover
        />
      </Wrap>
    </>
  )
}

UserPage.getLayout = page => <Layout>{page}</Layout>
export default UserPage

const Wrap = styled.div`
  padding: 16px 0;
`
const ContentWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 16px;
  padding: 16px 0;
  justify-content: center;
`

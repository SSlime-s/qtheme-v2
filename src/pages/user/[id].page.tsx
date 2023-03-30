import { InfiniteLoad } from '@/components/InfiniteLoad'
import { Layout } from '@/components/layout'
import { FullWidthContent, Message } from '@/components/Message'
import { PreviewCard } from '@/components/PreviewCard'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { useCurrentTheme } from '@/utils/theme/hooks'
import styled from '@emotion/styled'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '../_app.page'
import { useAuthorThemes } from './hooks'

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

  if (isLoading) {
    return <div>loading...</div>
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) {
    return <div>error</div>
  }

  return (
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

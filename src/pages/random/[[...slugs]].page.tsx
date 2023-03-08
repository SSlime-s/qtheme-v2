import { Layout } from '@/components/layout'
import { PreviewCard } from '@/components/PreviewCard'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { useCurrentTheme } from '@/utils/theme/hooks'
import { assertIsArray } from '@/utils/typeUtils'
import { GetServerSidePropsContext } from 'next'
import { NextPageWithLayout } from '../_app.page'
import { useRandomTheme } from './hooks'

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
        destination: '/random',
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

const RandomPage: NextPageWithLayout<Props> = ({ userId, filter }) => {
  useSetUserId(userId)

  const {
    theme,
    isLoading,
    error,
    mutate: { changeNext },
  } = useRandomTheme(filter === 'all' ? null : filter)
  const {
    mutate: { changeTheme },
  } = useCurrentTheme()

  if (error !== undefined) {
    return <div>Error: {error.message}</div>
  }
  if (isLoading || theme === null) {
    return <div>Loading...</div>
  }

  return (
    <>
      <button onClick={changeNext}>Next</button>
      <PreviewCard themeInfo={theme} changeTheme={changeTheme} />
    </>
  )
}
export default RandomPage
RandomPage.getLayout = page => {
  return <Layout>{page}</Layout>
}

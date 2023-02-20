import { Layout } from '@/components/layout'
import { PreviewCard } from '@/components/PreviewCard'
import { extractShowcaseUser } from '@/lib/extractUser'
import { useCurrentTheme } from '@/lib/theme/hooks'
import { assertIsArray } from '@/lib/typeUtils'
import { GetServerSidePropsContext } from 'next'
import { Suspense } from 'react'
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
  const {
    theme,
    error,
    mutate: { changeNext },
  } = useRandomTheme(filter === 'all' ? null : filter)
  const {
    mutate: { changeTheme },
  } = useCurrentTheme()

  if (error !== undefined) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <button onClick={changeNext}>Next</button>
      <PreviewCard themeInfo={theme} changeTheme={changeTheme} />
    </Suspense>
  )
}
export default RandomPage
RandomPage.getLayout = page => {
  return <Layout>{page}</Layout>
}

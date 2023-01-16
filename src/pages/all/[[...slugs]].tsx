import { Layout } from '@/components/layout'
import { PreviewCard } from '@/components/PreviewCard'
import { extractShowcaseUser } from '@/lib/extractUser'
import { useTheme, useThemeList } from '@/lib/theme/hooks'
import { assertIsArray } from '@/lib/types'
import styled from '@emotion/styled'
import { GetServerSidePropsContext, NextPage } from 'next'
import { NextPageWithLayout } from '@/pages/_app'

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
  const {
    themes,
    total,
    mutate: { loadMore, toggleLike },
  } = useThemeList(filter === 'all' ? null : filter, null, null)
  const {
    mutate: { changeTheme },
  } = useTheme()

  return (
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
  )
}
export default AllPage
AllPage.getLayout = page => {
  return <Layout>{page}</Layout>
}

const Wrap = styled.div`
  /* TODO: grid でいい感じに並べる */
`

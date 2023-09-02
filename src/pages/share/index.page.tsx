import styled from '@emotion/styled'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import type { NextPageWithLayout } from '@/pages/_app.page'
import type { FormattedTheme } from '@/utils/theme/hooks'
import type { GetServerSidePropsContext } from 'next'

import { CopyButton } from '@/components/CopyButton'
import { Error as ErrorPage } from '@/components/Error'
import { LargePreviewCard } from '@/components/LargePreviewCard'
import { LoadingBar } from '@/components/LoadingBar'
import { FullWidthContent, H1, H2, Message } from '@/components/Message'
import { SEO, ogImageUrl } from '@/components/SEO'
import { TextBox } from '@/components/TextBox'
import { Layout } from '@/components/layout'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { isMobile } from '@/utils/isMobile'
import { resolveTheme } from '@/utils/theme'
import { useCurrentTheme } from '@/utils/theme/hooks'
import { decodeTheme } from '@/utils/themeCodec'
import { pageTitle } from '@/utils/title'
import { WrapResolver } from '@/utils/wrapper'
import { BreakStyle, BudouJa } from '@/utils/wrapper/BudouX'
import { Linkify } from '@/utils/wrapper/Linkify'
import { ReplaceNewLine } from '@/utils/wrapper/ReplaceNewLine'

const DUMMY_AUTHOR = 'traP'

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

const ThemePage: NextPageWithLayout<Props> = ({ userId }) => {
  useSetUserId(userId)

  const author = DUMMY_AUTHOR

  const { t } = useRouter().query as { t?: string }
  const theme = useMemo(() => {
    if (t === undefined) {
      return undefined
    }

    return decodeTheme(t)
  }, [t])

  const dummyFormattedTheme = useMemo<FormattedTheme | undefined>(() => {
    if (theme === undefined || t === undefined) {
      return undefined
    }
    if (theme instanceof Error) {
      return undefined
    }

    return {
      ...theme,
      author,
      visibility: 'public',
      createdAt: new Date().toISOString(),
      id: t,
      isLike: false,
      likes: 0,
    }
  }, [author, t, theme])

  const resolvedTheme = useMemo(() => {
    if (theme === undefined) {
      return undefined
    }
    if (theme instanceof Error) {
      return undefined
    }

    return resolveTheme(theme.theme)
  }, [theme])

  const themeString = useMemo(() => {
    if (theme === undefined) {
      return undefined
    }
    if (theme instanceof Error) {
      return undefined
    }

    return JSON.stringify(theme.theme)
  }, [theme])

  const {
    mutate: { changeTheme },
  } = useCurrentTheme()

  if (theme instanceof Error) {
    return <ErrorPage statusCode={404} />
  }

  if (
    theme === undefined ||
    resolvedTheme === undefined ||
    themeString === undefined ||
    dummyFormattedTheme === undefined
  ) {
    return <LoadingBar />
  }

  return (
    <>
      <Head>
        <title>{pageTitle(theme.title)}</title>
      </Head>
      <SEO
        title={theme.title}
        description={theme.description}
        imageUrl={ogImageUrl(theme.theme, author)}
        url={`/share?t=${t}`}
      />
      <Wrap>
        <MainWrap>
          <Message
            iconUser={author}
            content={
              <>
                <H1>{theme.title}</H1>
                <FullWidthContent>
                  <LargePreviewCard
                    theme={dummyFormattedTheme}
                    resolvedTheme={resolvedTheme}
                    changeTheme={changeTheme}
                    noId
                  />
                </FullWidthContent>
              </>
            }
            date={''}
            tag={theme.type}
            name={author}
            stamps={<></>}
          />
          <Message
            iconUser={author}
            content={
              <>
                <H2>詳細</H2>
                <BreakP>
                  <WrapResolver Wrapper={[Linkify, BudouJa, ReplaceNewLine]}>
                    {theme.description}
                  </WrapResolver>
                </BreakP>
              </>
            }
            date={''}
            tag={theme.type}
            name={author}
          />
        </MainWrap>
        <CopyBox
          defaultValue={themeString}
          after={<After text={themeString} />}
          readOnly
        />
      </Wrap>
    </>
  )
}
ThemePage.getLayout = page => <Layout>{page}</Layout>
export default ThemePage

const Wrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr max-content;
`
const MainWrap = styled.div`
  contain: strict;
  overflow-y: auto;
`
export const BreakP = styled.p`
  ${BreakStyle}
`

const CopyBox = styled(TextBox)`
  margin: 0 32px 20px;
  & textarea {
    white-space: nowrap;
  }
  ${isMobile} {
    border-radius: 0;
    margin: 0;
  }
`

interface AfterProps {
  text: string
}
const After: React.FC<AfterProps> = ({ text }) => {
  return (
    <AfterWrap>
      <CopyButtonWrap>
        <CopyButton text={text} />
      </CopyButtonWrap>
    </AfterWrap>
  )
}
const AfterWrap = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0 8px;
`
const CopyButtonWrap = styled.div`
  height: 24px;
  width: 24px;
  font-size: 24px;
`

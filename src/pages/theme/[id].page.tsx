import { GlassmorphismStyle } from '@/components/Glassmorphism'
import { Layout } from '@/components/layout'
import { SmallPreview } from '@/components/preview'
import { useCurrentTheme, useTheme } from '@/utils/theme/hooks'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '@/pages/_app.page'
import { H1, H2, Message } from '@/components/Message'
import { ReadOnlyTextBox } from '@/components/TextBox'
import { CopyButton } from '@/components/CopyButton'
import { FavoriteButton } from '@/components/FavoriteButton'
import { useMemo } from 'react'
import { GetServerSidePropsContext } from 'next'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { lightTheme } from '@/utils/theme/default'

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

  const { id } = useRouter().query as { id: string }
  const {
    theme,
    resolvedTheme,
    mutate: { toggleLike },
  } = useTheme(id)
  const {
    currentTheme,
    mutate: { changeTheme },
  } = useCurrentTheme()

  const themeString = useMemo(() => {
    if (theme === undefined) {
      return ''
    }
    return JSON.stringify(theme.theme)
  }, [theme])

  if (theme === undefined) {
    return <div>loading...</div>
  }

  return (
    <Wrap>
      <MainWrap>
        <Message
          iconUser={theme.author}
          content={
            <>
              <H1>{theme.title}</H1>
              <Card>
                <CardInner>
                  <SmallPreview theme={resolvedTheme} author={theme.author} />
                  <ChangeCurrentButton
                    onClick={() => {
                      void changeTheme(theme.id, theme)
                    }}
                  >
                    <span>change current to this</span>
                  </ChangeCurrentButton>
                </CardInner>
              </Card>
            </>
          }
          date={theme.createdAt}
          tag={theme.type}
          name={theme.author}
          stamps={
            <FavoriteButton
              isFavorite={theme.isLike}
              onClick={toggleLike}
              favoriteCount={theme.likes}
            />
          }
        />
        <Message
          iconUser={theme.author}
          content={
            <>
              <H2>詳細</H2>
              {theme.description}
            </>
          }
          date={theme.createdAt}
          tag={theme.type}
          name={theme.author}
        />
      </MainWrap>
      <CopyBox
        defaultValue={themeString}
        after={<After text={themeString} />}
      />
    </Wrap>
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

const Card = styled.div`
  ${GlassmorphismStyle}

  padding: 32px;
  margin: 32px auto;
  max-width: 600px;
  /* width: calc(100% - 32px); */
  width: 100%;
`
const CardInner = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
`
const ChangeCurrentButton = styled.button`
  cursor: pointer;
  display: grid;
  place-items: center;
  width: 100%;
  padding: 8px 0;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid ${lightTheme.basic.ui.tertiary};

  & > span {
    transition: transform 0.2s;
  }
  &:hover > span {
    transform: scale(1.05);
  }
`
const CopyBox = styled(ReadOnlyTextBox)`
  margin: 0 32px 20px;
  & textarea {
    white-space: nowrap;
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

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

const ThemePage: NextPageWithLayout = () => {
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
                <SmallPreview theme={resolvedTheme} author={theme.author} />
                <button
                  onClick={() => {
                    void changeTheme(theme.id, theme)
                  }}
                >
                  change to this
                </button>
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

  padding: 1rem;
  margin: 32px auto;
  max-width: 600px;
  /* width: calc(100% - 32px); */
  width: 100%;
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

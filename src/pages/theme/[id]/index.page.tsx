import { Layout } from '@/components/layout'
import { FormattedTheme, useCurrentTheme, useTheme } from '@/utils/theme/hooks'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '@/pages/_app.page'
import { H1, H2, Message } from '@/components/Message'
import { TextBox } from '@/components/TextBox'
import { CopyButton } from '@/components/CopyButton'
import { FavoriteButton } from '@/components/FavoriteButton'
import { useMemo } from 'react'
import { GetServerSidePropsContext } from 'next'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { isMobile } from '@/utils/isMobile'
import { LargePreviewCard } from '@/components/LargePreviewCard'
import { ColoredGlassmorphismStyle } from '@/components/Glassmorphism'
import { css } from '@emotion/react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import Link from 'next/link'

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
              <LargePreviewCard
                theme={theme}
                resolvedTheme={resolvedTheme}
                changeTheme={changeTheme}
              />
            </>
          }
          date={theme.createdAt}
          tag={theme.type}
          name={theme.author}
          stamps={
            <Controls theme={theme} toggleLike={toggleLike} userId={userId} />
          }
        />
        <Message
          iconUser={theme.author}
          content={
            <>
              <H2>詳細</H2>
              <p>{theme.description}</p>
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
        readOnly
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

interface ControlsProps {
  theme: FormattedTheme
  toggleLike: (isLike: boolean) => Promise<void>
  userId: string | null
}
const Controls: React.FC<ControlsProps> = ({ theme, toggleLike, userId }) => {
  return (
    <ControlsWrap>
      <FavoriteButton
        isFavorite={theme.isLike}
        onClick={toggleLike}
        favoriteCount={theme.likes}
      />
      {theme.author === userId && (
        <>
          <UpdateButton href={`/theme/${theme.id}/edit`} title='編集'>
            <AiFillEdit />
            編集
          </UpdateButton>
          <DeleteButton>
            <AiFillDelete />
            削除
          </DeleteButton>
        </>
      )}
    </ControlsWrap>
  )
}
const ControlsWrap = styled.div`
  display: flex;
`
const ControlButtonStyle = css`
  ${ColoredGlassmorphismStyle(
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.3)'
  )}
  border-radius: 8px;

  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  cursor: pointer;
  color: #333;

  transition: all 0.1s ease-in;

  &:hover {
    transform: scale(1.05);
  }
`
const UpdateButton = styled(Link)`
  ${ControlButtonStyle}
  margin-left: auto;
`
const DeleteButton = styled.button`
  ${ControlButtonStyle}
  ${ColoredGlassmorphismStyle('rgba(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.3)')}
  border-radius: 8px;
  margin-left: 16px;

  color: #fff;
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

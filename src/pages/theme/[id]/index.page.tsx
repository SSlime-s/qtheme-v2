import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { SWRConfig } from 'swr'

import { ConfirmModal } from './ConfirmModal'

import type { NextPageWithLayout } from '@/pages/_app.page'
import type { FormattedTheme } from '@/utils/theme/hooks'
import type { GetServerSidePropsContext } from 'next'

import { CopyButton } from '@/components/CopyButton'
import { Error } from '@/components/Error'
import { FavoriteButton } from '@/components/FavoriteButton'
import { ColoredGlassmorphismStyle } from '@/components/Glassmorphism'
import { LargePreviewCard } from '@/components/LargePreviewCard'
import { LoadingBar } from '@/components/LoadingBar'
import { FullWidthContent, H1, H2, Message } from '@/components/Message'
import { SEO, ogImageUrl } from '@/components/SEO'
import { TextBox } from '@/components/TextBox'
import { Layout } from '@/components/layout'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { isMobile } from '@/utils/isMobile'
import { useConfirmModal } from '@/utils/modal/ConfirmModal/hooks'
import {
  prefetchUseTheme,
  useCurrentTheme,
  useTheme,
} from '@/utils/theme/hooks'
import { pageTitle } from '@/utils/title'
import { WrapResolver } from '@/utils/wrapper'
import { BreakStyle, BudouJa } from '@/utils/wrapper/BudouX'
import { Linkify } from '@/utils/wrapper/Linkify'
import { ReplaceNewLine } from '@/utils/wrapper/ReplaceNewLine'

export const getServerSideProps = async ({
  req,
  params,
}: GetServerSidePropsContext<{ id: string }>) => {
  const userId = extractShowcaseUser(req)

  const prefetchData =
    params === undefined ? {} : await prefetchUseTheme(params.id)

  return {
    props: {
      userId: userId ?? null,
      fallback: prefetchData,
    },
  }
}

type Props = NonNullable<
  Awaited<ReturnType<typeof getServerSideProps>>['props']
>
const ThemePage: NextPageWithLayout<Props> = ({ fallback, ...props }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <ThemePageInner {...props} />
    </SWRConfig>
  )
}
ThemePage.getLayout = page => <Layout>{page}</Layout>
export default ThemePage

const ThemePageInner: React.FC<Omit<Props, 'fallback'>> = ({ userId }) => {
  useSetUserId(userId)

  const { id } = useRouter().query as { id: string }
  const {
    theme,
    resolvedTheme,
    error,
    mutate: { toggleLike, deleteTheme },
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

  if (error !== undefined) {
    const isNotFound = (error.message as string)
      .trimStart()
      .startsWith('Not found')
    return <Error statusCode={isNotFound ? 404 : 500} />
  }

  if (theme === undefined) {
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
        imageUrl={ogImageUrl(theme.theme, theme.author)}
        url={`/theme/${theme.id}`}
      />
      <Wrap>
        <MainWrap>
          <Message
            iconUser={theme.author}
            content={
              <>
                <H1>{theme.title}</H1>
                <FullWidthContent>
                  <LargePreviewCard
                    theme={theme}
                    resolvedTheme={resolvedTheme}
                    changeTheme={changeTheme}
                  />
                </FullWidthContent>
              </>
            }
            date={theme.createdAt}
            tag={theme.type}
            name={theme.author}
            stamps={
              <FullWidthContent>
                <Controls
                  theme={theme}
                  toggleLike={toggleLike}
                  userId={userId}
                  deleteTheme={deleteTheme}
                />
              </FullWidthContent>
            }
          />
          <Message
            iconUser={theme.author}
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
            date={theme.createdAt}
            tag={theme.type}
            name={theme.author}
          />
        </MainWrap>
        <CopyBox
          defaultValue={themeString}
          after={<After text={themeString} />}
          aria-label='テーマのjson'
          readOnly
        />
      </Wrap>
    </>
  )
}

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

interface ControlsProps {
  theme: FormattedTheme
  toggleLike: (isLike: boolean) => Promise<void>
  deleteTheme: () => Promise<void>
  userId: string | null
}
const Controls: React.FC<ControlsProps> = ({
  theme,
  toggleLike,
  userId,
  deleteTheme,
}) => {
  const {
    modalProps,
    cancel,
    isOpen,
    ok,
    titleProps,
    titleRef,
    triggerRef,
    waitConfirm,
  } = useConfirmModal('theme/[id]/delete')

  const router = useRouter()
  const handleDelete = useCallback(async () => {
    const confirmed = await waitConfirm()
    if (!confirmed) {
      return
    }
    if (confirmed) {
      try {
        await deleteTheme()
        await router.push(`/user/${theme.author}`)
      } catch (e) {
        console.error(e)
      }
    }
  }, [deleteTheme, router, theme.author, waitConfirm])

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
          <DeleteButton onClick={handleDelete} ref={triggerRef}>
            <AiFillDelete />
            削除
          </DeleteButton>

          {isOpen && (
            <ConfirmModal
              {...modalProps}
              titleProps={{
                ...titleProps,
                ref: titleRef,
              }}
              onCancel={cancel}
              onOk={ok}
            />
          )}
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

  transition: transform 0.1s ease-in;

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
        <CopyButton text={text} title='テーマのコピー' />
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

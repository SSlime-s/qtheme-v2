import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { lightTheme } from '@repo/theme/default'
import { SmallPreview } from '@repo/theme-preview'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { HiArrowRight } from 'react-icons/hi'

import { GlassmorphismStyle } from '@/components/Glassmorphism'
import { extractShowcaseUser } from '@/utils/extractUser'
import { isMobile, useIsMobile } from '@/utils/isMobile'
import { useLoginUrl } from '@/utils/useLoginUrl'

import { Logo } from './components/Logo'
import { TrimMarkGroup } from './components/TrimMark'
import { useRandomTheme } from './random/hooks'

import type { GetServerSideProps, NextPage } from 'next'

const Fluid = dynamic(
  () => import('@/components/Fluid.client').then(mod => mod.Fluid),
  {
    ssr: false,
  }
)

export const getServerSideProps = (async ({ req }) => {
  const userId = extractShowcaseUser(req)

  // 部員とわかってる人はトップページを表示しない
  if (userId !== undefined) {
    return {
      redirect: {
        destination: '/random',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}) satisfies GetServerSideProps

const Home: NextPage = () => {
  const [isShowTopPage, setIsShowTopPage] = useState(true)
  const [isRendered, setIsRendered] = useState(false)

  const router = useRouter()
  useEffect(() => {
    if (localStorage.getItem('isShowTopPage') === '0') {
      void router.replace('/random')
      return
    }
    setIsRendered(true)
  }, [router])

  const onToggleShowTopPage = useCallback(() => {
    setIsShowTopPage(prev => !prev)
    localStorage.setItem('isShowTopPage', isShowTopPage ? '0' : '1')
  }, [isShowTopPage, setIsShowTopPage])

  const { theme, resolvedTheme } = useRandomTheme(null)

  const loginUrl = useLoginUrl()

  const isMobile = useIsMobile()

  return (
    <>
      <TopContainer hidden={!isRendered}>
        {theme !== null && resolvedTheme !== null && (
          <SmallPreview
            css={BackgroundStyle}
            theme={resolvedTheme}
            author={theme.author}
          />
        )}
        <BlurBackground />
        <FluidBackground />
        <TopContentWrap>
          <TrimMarkGroup size={32} margin={isMobile ? 16 : 32} />

          <Title>
            <Logo role='img' aria-label='Qtheme v2' />
          </Title>
          <ViewLink href='/random'>
            <span>テーマを見てみる</span>
            <HiArrowRight />
          </ViewLink>

          <LoginButton href={loginUrl}>
            すでに部員の方はこちら
            <HiArrowRight />
          </LoginButton>

          <Label>
            <Checkbox
              type='checkbox'
              checked={!isShowTopPage}
              onChange={onToggleShowTopPage}
            />
            <span>このページを今後表示しない</span>
          </Label>
          {theme !== null && (
            <CurrentLink href={`/theme/${theme.id}`}>
              {theme.title} by {theme.author}
            </CurrentLink>
          )}
        </TopContentWrap>
      </TopContainer>
    </>
  )
}
export default Home

const TopContainer = styled.main`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: grid;
  place-items: center;

  &[hidden] {
    display: none;
  }
`
const BackgroundStyle = css`
  position: absolute;
  top: 0;
  height: 100%;
  min-width: 100%;
  aspect-ratio: 16 / 9;
`
const BlurBackground = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.7);
`
const FluidBackground = styled(Fluid)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const TopContentWrap = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  padding: 80px;

  ${isMobile} {
    padding: 48px;
  }
`
const Title = styled.h1`
  font-size: 3rem;
  margin: 8px 0;

  max-width: 100%;

  svg {
    width: 100%;
    height: auto;
  }

  backdrop-filter: blur(20px);
  background-color: ${lightTheme.basic.accent.primary}33;
  margin-right: auto;
  padding: 24px 16px;
  border-radius: 8px;
`

const LinkButtonStyle = css`
  display: flex;
  pointer-events: auto;
  ${GlassmorphismStyle}
  border-radius: 8px;
  padding: 12px 16px;
  align-items: center;
  vertical-align: middle;
  gap: 4px;
  line-height: 1;
  margin-top: 24px;
  margin-right: auto;

  & > svg {
    transition: transform 0.2s ease-out;
  }
  &:hover > svg {
    transform: translateX(4px);
  }
`
const ViewLink = styled(Link)`
  ${LinkButtonStyle}
`
const LoginButton = styled.a`
  ${LinkButtonStyle}
`

const Label = styled.label`
  display: flex;
  user-select: none;
  cursor: pointer;
  align-items: center;
  margin: 4px 0;
  margin-right: auto;
  pointer-events: auto;
  margin-top: auto;
  gap: 8px;
`
const Checkbox = styled.input`
  width: 24px;
  height: 24px;
  appearance: auto;

  &:focus {
    outline: 2px solid ${lightTheme.basic.accent.primary};
  }
`

const CurrentLink = styled(Link)`
  pointer-events: auto;
  margin-left: auto;
  width: auto;
`

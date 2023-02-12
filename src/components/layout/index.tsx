import { useIsMobile } from '@/lib/isMobile'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Header } from './Header'
import { Navbar } from './Navbar'
import { DefaultSidebarContent, Sidebar } from './Sidebar'

interface Props {
  userId?: string
  sidebar?: React.ReactNode
}

export const Layout: React.FC<PropsWithChildren<Props>> = ({
  userId: _u,
  children,
  sidebar: rawSidebar,
}) => {
  const sidebar = rawSidebar ?? <DefaultSidebarContent />
  const isMobile = useIsMobile()
  const router = useRouter()
  const nowChannelPath = useMemo(() => {
    const path = router.asPath
      .split('/')
      .filter(p => p !== '')
      .map(p => {
        const split = p.split('?')
        return split[0]
      })
    return path
  }, [router])

  const mainRef = useRef<HTMLDivElement>(null)
  const scrollToSelf = useCallback(() => {
    if (!isMobile) {
      return
    }
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) {
      return
    }
    mainRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [isMobile, scrollToSelf])
  useEffect(() => {
    if (!isMobile) {
      return
    }
    scrollToSelf()
  }, [isMobile, scrollToSelf, router.asPath])

  return (
    <Container>
      <Navbar />
      <Header channelPath={nowChannelPath} />
      <DummyMain ref={mainRef} />
      <Main onClickCapture={scrollToSelf}>{children}</Main>
      <Sidebar>{sidebar}</Sidebar>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-areas: 'nav header header' 'nav main side';
  grid-template-columns: 340px 1fr 256px;
  grid-template-rows: 80px 1fr;
  width: 100%;
  height: 100%;

  position: relative;
  overflow: hidden;

  @media (max-width: 992px) {
    grid-template-areas: 'nav header side' 'nav main side';
    grid-template-columns: 320px 100vw 320px;
    grid-template-rows: 80px 1fr;
    width: calc(100vw + 640px);
    overflow: visible;
  }

  background: ${({ theme }) => theme.theme.basic.background.primary.default};

  & * {
    scrollbar-color: ${({ theme }) =>
      `${theme.theme.browser.scrollbarThumb} ${theme.theme.browser.scrollbarTrack}`};
    /* transition: scrollbar-color 0.3s; */
    &:hover,
    &:active {
      scrollbar-color: ${({ theme }) =>
        `${theme.theme.browser.scrollbarThumbHover} ${theme.theme.browser.scrollbarTrack}`};
    }

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    scrollbar-width: thin;

    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.theme.browser.scrollbarTrack};
      &:hover {
        background: ${({ theme }) => theme.theme.browser.scrollbarTrack};
      }
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.theme.browser.scrollbarThumb};
      transition: background 0.3s;
      border-radius: 3px;
      &:hover {
        background: ${({ theme }) => theme.theme.browser.scrollbarThumbHover};
      }
    }
    &::-webkit-scrollbar-corner {
      visibility: hidden;
      display: none;
    }
  }

  & *::selection {
    color: ${({ theme }) => theme.theme.browser.selectionText};
    background: ${({ theme }) => theme.theme.browser.selectionBackground};
  }
  & * {
    caret-color: ${({ theme }) => theme.theme.browser.caret};
  }
`

const Main = styled.main`
  grid-area: main;
  /* HACK: overflow: overlay が無効なブラウザ用の fallback */
  overflow: auto;
  overflow: overlay;
  contain: strict;
  height: 100%;
  background: ${({ theme }) => theme.theme.specific.mainViewBackground};

  @media (max-width: 992px) {
    position: sticky;
    left: 0;
    z-index: 20;
    scroll-snap-align: start;
  }
`
const DummyMain = styled.div`
  grid-area: main;
  display: none;

  @media (max-width: 992px) {
    display: block;
    pointer-events: none;
  }
`

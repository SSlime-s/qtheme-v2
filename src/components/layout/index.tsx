import { useIsMobile } from '@/lib/isMobile'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { PropsWithChildren, useMemo } from 'react'
import { Header } from './Header'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface Props {
  userId?: string
}

export const Layout: React.FC<PropsWithChildren<Props>> = ({
  userId: _u,
  children,
}) => {
  const isMobile = useIsMobile()
  const router = useRouter()
  const nowChannelPath = useMemo(() => {
    const path = router.asPath.split('/').filter(p => p !== '')
    return path
  }, [router])

  return (
    <Container>
      <Navbar />
      <Header channelPath={nowChannelPath} />
      <Main>{children}</Main>
      <Sidebar />
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
`

const Main = styled.main`
  grid-area: main;
  overflow: auto;
  contain: strict;
  height: 100%;
  background: ${({ theme }) => theme.theme.specific.mainViewBackground};
`

import { useIsMobile } from '@/lib/isMobile'
import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Navbar } from './Navbar'

interface Props {
  userId?: string
}

export const Layout: React.FC<PropsWithChildren<Props>> = ({
  userId: _u,
  children,
}) => {
  const isMobile = useIsMobile()

  return (
    <Container>
      <Navbar />
      <Header />
      <Main>{children}</Main>
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
`

const Main = styled.div`
  grid-area: main;
  overflow: auto;
  contain: strict;
  height: 100%;
`

import { useIsMobile } from '@/lib/isMobile'
import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { Header } from './Header'

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
      <Header />
      <Main>{children}</Main>
    </Container>
  )
  // return (
  //   <Container>
  //     <NavWrap>nav</NavWrap>
  //     <RightWrap>
  //       <HeaderWrap>
  //         <Header />
  //       </HeaderWrap>
  //       <MainSideWrap>
  //         <MainWrap>{children}</MainWrap>
  //         <SideWrap>side</SideWrap>
  //       </MainSideWrap>
  //     </RightWrap>
  //   </Container>
  // )
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
  /* height: 500px; */
`

// const Container = styled.div`
//   display: flex;
//   flex-direction: row;
//   flex-wrap: nowrap;
// `
// const NavWrap = styled.div`
//   width: 340px;
//   flex-grow: 0;
// `
// const RightWrap = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex-grow: 1;
// `
// const HeaderWrap = styled.div`
//   height: 80px;
// `
// const MainSideWrap = styled.div`
//   display: flex;
//   flex-direction: row;
//   flex-wrap: nowrap;
//   flex-grow: 1;
// `
// const MainWrap = styled.div`
//   flex-grow: 1;
// `
// const SideWrap = styled.div`
//   width: 256px;
//   flex-grow: 0;
// `

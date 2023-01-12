import styled from '@emotion/styled'

export const Navbar: React.FC = () => {
  return <Wrap>Navbar</Wrap>
}

const Wrap = styled.div`
  grid-area: nav;
  background-color: ${({ theme }) =>
    theme.theme.basic.background.secondary.default};
`

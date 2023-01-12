import styled from '@emotion/styled'

export const Sidebar: React.FC = () => {
  return <Wrap>Sidebar</Wrap>
}

const Wrap = styled.div`
  grid-area: side;
  background-color: ${({ theme }) =>
    theme.theme.basic.background.secondary.default};
`

import styled from '@emotion/styled'

export const Sidebar: React.FC = () => {
  return <Wrap>Sidebar</Wrap>
}

const Wrap = styled.aside`
  grid-area: side;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
`

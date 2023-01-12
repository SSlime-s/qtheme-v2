import styled from '@emotion/styled'

export const Header: React.FC = () => {
  return <Wrap>#favorite/path</Wrap>
}

const Wrap = styled.div`
  grid-area: header;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  border-bottom: solid 2px
    ${({ theme }) => theme.theme.basic.ui.tertiary.default};
`

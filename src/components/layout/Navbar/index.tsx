import styled from '@emotion/styled'
import { NavbarChannels } from './Channels'

export const Navbar: React.FC = () => {
  return (
    <Wrap>
      <div>Controls</div>
      <NavbarChannels />
    </Wrap>
  )
}

const Wrap = styled.div`
  grid-area: nav;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
  display: grid;
  grid-template-columns: 60px 1fr;
`

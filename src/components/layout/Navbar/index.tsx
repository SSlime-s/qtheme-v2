import styled from '@emotion/styled'
import { atom, useAtom } from 'jotai'
import { useCallback, useId, useMemo } from 'react'
import { NavbarChannels } from './Channels'
import { MdHome } from 'react-icons/md'
import { FaUser, FaWrench } from 'react-icons/fa'

type NavbarState = 'channel' | 'user' | 'custom'
const states = [
  'channel',
  'user',
  'custom',
] as const satisfies ReadonlyArray<NavbarState>
const titlesMap = {
  channel: 'ホーム',
  user: 'ユーザー',
  custom: 'カスタム',
} as const satisfies Record<NavbarState, string>
const NavbarAtom = atom<NavbarState>('channel')
export const Navbar: React.FC = () => {
  const tabIdPrefix = useId()

  return (
    <Wrap>
      <TabList role='tablist'>
        {states.map(s => (
          <Button key={s} state={s} idPrefix={tabIdPrefix} />
        ))}
      </TabList>
      {states.map(s => (
        <NavPanel key={s} state={s} idPrefix={tabIdPrefix} />
      ))}
    </Wrap>
  )
}
const TabList = styled.div`
  display: grid;
  width: 100%;
  grid-auto-flow: column;
  grid-auto-columns: 60px;
  grid-auto-rows: 60px;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 60px);
  place-items: center;
`

interface ButtonProps {
  state: NavbarState
  idPrefix: string
}
const Button: React.FC<ButtonProps> = ({ state, idPrefix }) => {
  const [current, setCurrent] = useAtom(NavbarAtom)
  const changeCurrent = useCallback(() => {
    setCurrent(state)
  }, [setCurrent, state])
  const id = `${idPrefix}-${state}`
  const isSelected = current === state

  return (
    <IconButton
      role='tab'
      id={id}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={changeCurrent}
      title={titlesMap[state]}
    >
      {state === 'channel' ? (
        <MdHome />
      ) : state === 'user' ? (
        <FaUser />
      ) : (
        <FaWrench />
      )}
    </IconButton>
  )
}

const IconButton = styled.button`
  height: 44px;
  width: 44px;
  cursor: pointer;
  background: transparent;
  position: relative;
  color: ${({ theme }) => theme.theme.basic.accent.primary.default};
  font-size: 20px;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  overflow: hidden;

  & > svg {
    transition: opacity 0.2s ease-in-out;
    opacity: 0.3;
  }
  &[aria-selected='true'] > svg {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  &[aria-selected='true']::after,
  &:hover::after {
    opacity: 0.1;
  }
`

interface NavPanelProps {
  state: NavbarState
  idPrefix: string
}
const NavPanel: React.FC<NavPanelProps> = ({ state, idPrefix }) => {
  const [current] = useAtom(NavbarAtom)
  const id = `${idPrefix}-${state}`
  const title = useMemo(() => titlesMap[state], [state])

  return (
    <Panel
      role='tabpanel'
      id={id}
      aria-labelledby={id}
      hidden={current !== state}
    >
      <Title>{title}</Title>
      {state === 'channel' ? (
        <NavbarChannels />
      ) : state === 'user' ? (
        <div>user</div>
      ) : (
        <div>custom</div>
      )}
    </Panel>
  )
}
const Panel = styled.div`
  display: grid;
  padding: 24px 0 0 8px;
  grid-template-rows: max-content 1fr;
  gap: 24px;

  &[hidden] {
    display: none;
  }
`
const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
`

const Wrap = styled.nav`
  grid-area: nav;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
  display: grid;
  grid-template-columns: 60px 1fr;
`

import styled from '@emotion/styled'
import { atom, useAtom, useSetAtom } from 'jotai'
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  useCallback,
  useMemo,
} from 'react'
import { NavbarChannels } from './Channels'
import { MdHome } from 'react-icons/md'
import { FaUser, FaWrench } from 'react-icons/fa'
import { NavbarCustom } from './Custom'
import { useControlledNamedTabList } from '@/utils/tablist'
import { isMobile } from '@/utils/isMobile'
import { UserIcon } from './UserIcon'
import { useUserId } from '@/utils/extractUser'
import { NavbarUsers } from './Users'

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
  const [state, setState] = useAtom(NavbarAtom)
  const { ariaTabListProps, ariaTabProps, ariaPanelProps } =
    useControlledNamedTabList(states, state, setState)

  const userId = useUserId()

  return (
    <>
      <DummyWrap />
      <Wrap {...ariaTabListProps}>
        <TabList role='tablist'>
          {states.map(s => (
            <Button key={s} state={s} {...ariaTabProps[s]} />
          ))}
        </TabList>
        <Selector>
          <UserIcon userId={userId ?? undefined} />
        </Selector>
        {states.map(s => (
          <NavPanel key={s} state={s} {...ariaPanelProps[s]} />
        ))}
      </Wrap>
    </>
  )
}
const Wrap = styled.nav`
  grid-area: nav;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 1fr max-content;
  grid-template-areas:
    'list panel'
    'selector panel';

  ${isMobile} {
    grid-template-columns: 1fr max-content;
    grid-template-rows: 32px 1fr 60px;
    grid-template-areas:
      '... selector'
      'panel panel'
      'list list';
    gap: 16px;
    position: sticky;
    left: 0;
    background: ${({ theme }) =>
      theme.theme.specific.navigationBarMobileBackground};
    padding: 16px;
  }
`
const DummyWrap = styled.div`
  grid-area: nav;
  display: hidden;

  ${isMobile} {
    display: block;
    pointer-events: none;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`

const Selector = styled.div`
  grid-area: selector;
  display: grid;
  width: 100%;
  grid-auto-flow: column;
  grid-auto-columns: 60px;
  grid-auto-rows: 60px;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 60px);
  place-items: center;
  font-size: 32px;

  ${isMobile} {
    grid-template-columns: repeat(auto-fill, 60px);
    grid-template-rows: 1fr;
  }
`
const TabList = styled.div`
  grid-area: list;
  display: grid;
  width: 100%;
  grid-auto-flow: column;
  grid-auto-columns: 60px;
  grid-auto-rows: 60px;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 60px);
  place-items: center;

  ${isMobile} {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    background: ${({ theme }) =>
      theme.theme.basic.background.secondary.default};
    border-radius: 4px;
  }
`

interface ButtonProps {
  state: NavbarState
}
const Button: React.FC<
  ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ state, ...props }) => {
  const setCurrent = useSetAtom(NavbarAtom)
  const changeCurrent = useCallback(() => {
    setCurrent(state)
  }, [setCurrent, state])

  return (
    <IconButton {...props} onClick={changeCurrent} title={titlesMap[state]}>
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
}
const NavPanel: React.FC<NavPanelProps & HTMLAttributes<HTMLDivElement>> = ({
  state,
  ...props
}) => {
  const title = useMemo(() => titlesMap[state], [state])

  return (
    <Panel {...props} hasRPad={state !== 'channel'}>
      <Title>{title}</Title>
      {state === 'channel' ? (
        <NavbarChannels />
      ) : state === 'user' ? (
        <NavbarUsers />
      ) : (
        <NavbarCustom />
      )}
    </Panel>
  )
}
const Panel = styled.div<{ hasRPad: boolean }>`
  grid-area: panel;
  display: grid;
  padding: 24px 0 0 8px;
  padding-right: ${({ hasRPad }) => (hasRPad ? '24px' : '0px')};
  grid-template-rows: max-content 1fr;
  gap: 24px;
  overflow-y: auto;

  &[hidden] {
    display: none;
  }

  ${isMobile} {
    background: ${({ theme }) =>
      theme.theme.basic.background.secondary.default};
    border-radius: 4px;
    padding-left: 16px;
    padding-right: ${({ hasRPad }) => (hasRPad ? '16px' : '0px')};
  }
`
const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
`

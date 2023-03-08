import { useAccordion, useHiddenTransition } from '@/utils/accordion'
import { ResolvedTheme } from '@/utils/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { BsHash } from 'react-icons/bs'

interface Props {
  name: string
  to: string
  selected?: boolean
}

export const ChannelAccordion: React.FC<PropsWithChildren<Props>> = ({
  name,
  selected,
  to,
  children,
}) => {
  const { isOpen, toggle, contentRef, contentHeight, ariaToggle, ariaContent } =
    useAccordion<HTMLDivElement>(8)
  const { ref: wrapRef, style: hiddenStyle } = useHiddenTransition(isOpen)

  return (
    <Wrap>
      <ChannelWrap
        aria-current={selected === true ? 'page' : 'false'}
        selected={selected}
      >
        <ToggleButton onClick={toggle} selected={selected} {...ariaToggle}>
          <BsHash />
        </ToggleButton>
        <ChannelLink href={to}>{name}</ChannelLink>
      </ChannelWrap>
      <ContentWrap
        ref={wrapRef}
        data-height={contentHeight}
        {...ariaContent}
        css={hiddenStyle}
      >
        <div ref={contentRef}>{children}</div>
      </ContentWrap>
    </Wrap>
  )
}
const Wrap = styled.div`
  margin: 4px 0;
`
const ChannelWrap = styled.div<{
  selected?: boolean
}>`
  display: grid;
  grid-template-columns: 29px 1fr;
  height: 32px;
  align-items: center;
  color: ${({ theme, ...props }) =>
    props.selected === true
      ? theme.theme.basic.accent.primary.default
      : theme.theme.basic.ui.primary.default};
  font-weight: ${props => (props.selected === true ? 'bold' : 'normal')};
  position: relative;
  padding-left: 8px;
`
const ToggleButton = styled.button<{
  selected?: boolean
}>`
  display: grid;
  justify-self: end;
  height: 26px;
  width: 26px;
  font-size: 22px;
  place-items: center;
  padding: 0;
  cursor: pointer;
  border: ${({ theme, ...props }) =>
      props.selected === true
        ? theme.theme.basic.accent.primary.default
        : theme.theme.basic.ui.primary.default}
    2px solid;
  border-radius: 4px;
  background: transparent;
  position: relative;
  transition: all 0.1s ease;

  &[aria-expanded='true'] {
    background: ${({ theme, ...props }) =>
      props.selected === true
        ? theme.theme.basic.accent.primary.default
        : theme.theme.basic.ui.primary.default};
    color: ${({ theme }) => theme.theme.specific.channelHashOpened};
  }

  &:hover::before {
    background: ${({ theme, ...props }) =>
      props.selected === true
        ? theme.theme.basic.accent.primary.default
        : theme.theme.basic.ui.primary.default};
    opacity: 0.2;
    content: '';
    border-radius: 4px;
    position: absolute;
    inset: -4px;
  }
`
const ChannelTextStyle = ({
  theme,
}: {
  theme: { theme: ResolvedTheme }
}) => css`
  width: 100%;
  padding-left: calc(8px + 3px);

  &:after {
    content: '';
    border-radius: 9999px 0 0 9999px;
    opacity: 0.1;
    background: transparent;
    position: absolute;
    top: -2px;
    bottom: -2px;
    left: 0;
    width: 100%;
    pointer-events: none;
  }

  [data-selected='true'] &:after {
    background: ${theme.theme.basic.accent.primary.default};
  }
`
const ChannelLink = styled(Link)`
  ${ChannelTextStyle}

  &:hover:after {
    background: ${({ theme }) => theme.theme.basic.ui.primary.default};
  }
`
const ContentWrap = styled.div<{
  'data-height'?: number
}>`
  overflow: hidden;
  transition: all 0.3s ease;
  height: ${({ 'data-height': height }) =>
    height === undefined ? 'auto' : height}px;
  padding-left: 12px;

  &[aria-hidden='true'] {
    height: 0;
  }
`

export const Channel: React.FC<Props> = ({ name, to, selected }) => {
  return (
    <Wrap>
      <Link href={to}>
        <ChannelWrap data-selected={selected}>
          <CenteredBsHash />
          <ChannelText selected={selected}>{name}</ChannelText>
        </ChannelWrap>
      </Link>
    </Wrap>
  )
}
const CenteredBsHash = styled(BsHash)`
  place-self: center;
  justify-self: end;
  font-size: 24px;
`
const ChannelText = styled.div<{
  selected?: boolean
}>`
  ${ChannelTextStyle}

  *:hover > * > &:after {
    background: ${({ theme, selected }) =>
      selected === true ? undefined : theme.theme.basic.ui.primary.default};
  }
`

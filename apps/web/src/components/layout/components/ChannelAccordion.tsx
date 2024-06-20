import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { BsHash } from 'react-icons/bs'

import { useAccordion, useHiddenTransition } from '@/utils/accordion'

import type { ResolvedTheme } from '@/utils/theme'
import type { PropsWithChildren } from 'react'

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
      <ChannelWrap aria-current={selected === true ? 'page' : 'false'}>
        <ToggleButton
          onClick={toggle}
          selected={selected}
          aria-label={
            selected === true
              ? `${name}以下を折りたたむ`
              : `${name}以下を展開する`
          }
          {...ariaToggle}
        >
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
const ChannelWrap = styled.div`
  display: grid;
  grid-template-columns: 29px 1fr;
  height: 32px;
  align-items: center;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  font-weight: normal;
  &[aria-current='page'] {
    color: ${({ theme }) => theme.theme.basic.accent.primary.default};
    font-weight: bold;
  }
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
  transition-property: background, border-color, color;

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
    transition: background 0.2s ease-in-out;
  }

  [aria-current='page'] &:after {
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
  transition: height 0.3s ease;
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
        <ChannelWrap aria-current={selected === true ? 'page' : 'false'}>
          <CenteredBsHash />
          <ChannelText>{name}</ChannelText>
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
const ChannelText = styled.div`
  ${ChannelTextStyle}

  *:hover > *:not([aria-current='page']) > &:after {
    background: ${({ theme }) => theme.theme.basic.ui.primary.default};
  }
`

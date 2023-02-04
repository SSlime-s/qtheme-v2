import { ResolvedTheme } from '@/lib/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
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
  const contentsId = useId()

  const ref = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined
  )

  const toggleOpen = useCallback(() => {
    setIsOpen(isOpen => !isOpen)
  }, [])

  useEffect(() => {
    if (ref.current === null) {
      return
    }

    const content = ref.current
    const setHeight = () => {
      // margin の分だけ足す
      setContentHeight(content.clientHeight + 8)
    }
    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(content)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Wrap>
      <ChannelWrap data-selected={selected}>
        <ToggleButton
          onClick={toggleOpen}
          aria-controls={contentsId}
          aria-expanded={isOpen}
          data-selected={selected}
        >
          <BsHash />
        </ToggleButton>
        <ChannelLink href={to}>{name}</ChannelLink>
      </ChannelWrap>
      <ContentWrap
        data-height={contentHeight}
        // FIXME: ページ内検索で引っかからないように hidden もつけるべき
        aria-hidden={!isOpen}
      >
        <div ref={ref} id={contentsId}>
          {children}
        </div>
      </ContentWrap>
    </Wrap>
  )
}
const Wrap = styled.div`
  margin: 4px 0;
`
const ChannelWrap = styled.div<{
  'data-selected'?: boolean
}>`
  display: grid;
  grid-template-columns: 29px 1fr;
  height: 32px;
  align-items: center;
  color: ${({ theme, ...props }) =>
    props['data-selected'] === true
      ? theme.theme.basic.accent.primary.default
      : theme.theme.basic.ui.primary.default};
  font-weight: ${props =>
    props['data-selected'] === true ? 'bold' : 'normal'};
  position: relative;
  padding-left: 8px;
`
const ToggleButton = styled.button<{
  'data-selected'?: boolean
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
      props['data-selected'] === true
        ? theme.theme.basic.accent.primary.default
        : theme.theme.basic.ui.primary.default}
    2px solid;
  border-radius: 4px;
  background: transparent;
  position: relative;
  transition: all 0.1s ease;

  &[aria-expanded='true'] {
    background: ${({ theme, ...props }) =>
      props['data-selected'] === true
        ? theme.theme.basic.accent.primary.default
        : theme.theme.basic.ui.primary.default};
    color: ${({ theme }) => theme.theme.specific.channelHashOpened};
  }

  &:hover::before {
    background: ${({ theme, ...props }) =>
      props['data-selected'] === true
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

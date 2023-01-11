import { ResolvedTheme } from '@/lib/theme'
import { ThemeProvider } from '@emotion/react'
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
  theme: ResolvedTheme
  to: string
  selected?: boolean
}

export const ChannelAccordion: React.FC<PropsWithChildren<Props>> = ({
  name,
  theme,
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
  const hidden = isOpen ? undefined : 'until-found'

  useEffect(() => {
    if (ref.current === null) {
      return
    }

    const content = ref.current
    const setHeight = () => {
      setContentHeight(content.clientHeight)
    }
    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(content)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <ThemeProvider
      theme={{
        theme,
      }}
    >
      <div>
        <ChannelWrap data-selected={selected}>
          <ToggleButton
            onClick={toggleOpen}
            aria-controls={contentsId}
            aria-expanded={isOpen}
            data-selected={selected}
          >
            <BsHash height={22} width={22} />
          </ToggleButton>
          <ChannelLink href={to}>{name}</ChannelLink>
        </ChannelWrap>
        <ContentWrap data-height={contentHeight}>
          <div
            ref={ref}
            id={contentsId}
            aria-hidden={!isOpen}
            // react が until-found に対応していないため as で無理やりキャストしてる
            hidden={hidden as unknown as boolean}
          >
            {children}
          </div>
        </ContentWrap>
      </div>
    </ThemeProvider>
  )
}
const ChannelWrap = styled.div<{
  'data-selected'?: boolean
}>`
  display: grid;
  grid-template-columns: 32px 1fr;
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
  place-self: center;
  height: 22px;
  width: 22px;
  place-items: center;
  padding: 0;
  cursor: pointer;
  border: ${({ theme, ...props }) =>
      props['data-selected'] === true
        ? theme.theme.basic.accent.primary.default
        : theme.theme.basic.ui.primary.default}
    2px solid;
  border-radius: 4px;
  background-color: transparent;
  position: relative;

  &[aria-expanded='true'] {
    background-color: ${({ theme, ...props }) =>
      props['data-selected'] === true
        ? theme.theme.basic.accent.primary.default
        : theme.theme.basic.ui.primary.default};
    color: ${({ theme }) => theme.theme.specific.channelHashOpened};
  }

  &:hover::before {
    background-color: ${({ theme, ...props }) =>
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
const ChannelLink = styled(Link)`
  width: 100%;
  padding-left: 8px;

  &:after {
    content: '';
    border-radius: 9999px 0 0 9999px;
    opacity: 0.1;
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &:hover:after {
    background-color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  }

  [data-selected='true'] &:after {
    background-color: ${({ theme }) =>
      theme.theme.basic.accent.primary.default};
  }
`
const ContentWrap = styled.div<{
  'data-height'?: number
}>`
  overflow: hidden;
  transition: all 0.3s ease;
  height: ${({ 'data-height': height }) =>
    height === undefined ? 'auto' : height}px;

  &[aria-hidden='true'] {
    height: 0;
  }
`

export const Channel: React.FC<Props> = ({ name, theme }) => {
  return <></>
}

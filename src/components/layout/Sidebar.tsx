import { isMobile, useIsMobile } from '@/utils/isMobile'
import { ResolvedTheme } from '@/utils/theme'
import { useCurrentTheme } from '@/utils/theme/hooks'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { RxReset } from 'react-icons/rx'
import { BreakStyle, BudouJa } from '@/components/wrapper/BudouX'
import { ReplaceNewLine } from '@/components/wrapper/ReplaceNewLine'
import { Linkify } from '@/components/wrapper/Linkify'
import { WrapResolver } from '@/utils/wrapper'

// eslint-disable-next-line @typescript-eslint/ban-types
export const Sidebar: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (ref.current === null) return
    if (!isMobile) return

    setIsOpen(false)
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.6) {
            setIsOpen(true)
          } else {
            setIsOpen(false)
          }
        }
      },
      {
        root: null,
        threshold: [0, 0.4, 0.6],
      }
    )
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [isMobile, ref])

  return (
    <>
      <Cover hidden={!isOpen} />
      <Wrap ref={ref}>{children}</Wrap>
    </>
  )
}
export const DefaultSidebarContent: React.FC = () => {
  const {
    currentThemeInfo,
    mutate: { changeToDefaultTheme },
  } = useCurrentTheme()
  const [isConfirm, setIsConfirm] = useState(false)
  const [confirmTimeoutId, setConfirmTimeoutId] = useState<NodeJS.Timeout>()
  const confirmedToDefaultTheme = useCallback(() => {
    if (isConfirm) {
      changeToDefaultTheme()
      setIsConfirm(false)
      if (confirmTimeoutId) {
        clearTimeout(confirmTimeoutId)
        setConfirmTimeoutId(undefined)
      }
      return
    }

    setIsConfirm(true)
    const timeoutId = setTimeout(() => {
      setIsConfirm(false)
      setConfirmTimeoutId(undefined)
    }, 2000)
    setConfirmTimeoutId(timeoutId)
  }, [changeToDefaultTheme, confirmTimeoutId, isConfirm])

  return (
    <>
      <LinkBlock href={`/theme/${currentThemeInfo?.id}`}>
        <Title>現在のテーマ</Title>
        <p>{currentThemeInfo?.title}</p>
      </LinkBlock>
      <Block>
        <Title>詳細</Title>
        <BreakP>
          <WrapResolver Wrapper={[Linkify, BudouJa, ReplaceNewLine]}>
            {currentThemeInfo?.description ?? 'undefined'}
          </WrapResolver>
        </BreakP>
      </Block>
      <ResetButton onClick={confirmedToDefaultTheme}>
        {isConfirm ? 'もう一度クリックで確定' : 'デフォルトテーマに戻す'}
        <RxReset />
      </ResetButton>
    </>
  )
}

const Wrap = styled.aside`
  grid-area: side;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
  padding: 32px;

  ${isMobile} {
    position: relative;
    z-index: 30;
    scroll-snap-align: end;
    scroll-snap-stop: always;
  }
`
export const BlockStyle = ({
  theme,
}: {
  theme: { theme: ResolvedTheme }
}) => css`
  background: ${theme.theme.basic.background.primary.default};
  color: ${theme.theme.basic.ui.secondary.default};
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: block;
`
export const Block = styled.div`
  ${BlockStyle}
`
export const LinkBlock = styled(Link)`
  ${BlockStyle}
`
export const BreakP = styled.p`
  ${BreakStyle}
`
export const ResetButton = styled.button`
  ${BlockStyle}

  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: start;
  font-weight: bold;
  gap: 4px;

  & > svg {
    font-size: 1.5rem;
    margin-top: 2px;
  }
`
const Title = styled.p`
  font-weight: bold;
  margin-bottom: 8px;
`

const Cover = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: rgba(25, 26, 29, 0.5);
  opacity: 0;
  height: 100vh;
  width: 100vw;
  transition: opacity 0.2s ease-in-out;
  z-index: 29;
  display: none;

  ${isMobile} {
    display: block;
    opacity: 1;

    &[hidden] {
      opacity: 0;
    }
  }
`

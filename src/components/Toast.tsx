import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import ReactDOM from 'react-dom'

import { useToastList } from '@/utils/toast'

import type { ToastOptions } from '@/utils/toast'
import type { Theme } from '@emotion/react'

type Props = Omit<ToastOptions, 'durationMs' | 'key'> & {
  toastKey: string
}
const Toast: React.FC<Props> = ({ type, content, toastKey, onClick }) => {
  const Wrap = useMemo(() => {
    return onClick ? WrapButton : WrapDiv
  }, [onClick])

  return (
    <Wrap onClick={onClick} key={toastKey} data-type={type}>
      {content}
    </Wrap>
  )
}
const slideIn = keyframes`
  from {
    transform: translateX(-50%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    transform: translateX(0);
  }
`
const WrapStyle = ({ theme: { theme } }: { theme: Theme }) => css`
  filter: drop-shadow(0 2px 4px rgba(33, 63, 99, 0.3));
  color: #fff;
  display: flex;
  align-items: center;
  width: 320px;
  max-width: calc(100vw - 40px);
  margin: 12px 0;
  padding: 8px;
  border-radius: 4px;
  user-select: none;

  &[data-type='success'] {
    background: ${theme.basic.accent.primary.default};
  }
  &[data-type='error'] {
    background: ${theme.basic.accent.error.default};
  }
  &[data-type='info'] {
    background: ${theme.basic.ui.secondary.default};
  }

  animation: ${slideIn} 0.3s ease-out;
`
const WrapDiv = styled.div<{ 'data-type': ToastOptions['type'] }>`
  ${WrapStyle}
`
const WrapButton = styled.button<{ 'data-type': ToastOptions['type'] }>`
  ${WrapStyle}

  cursor: pointer;
`

const RawToastContainer: React.FC = () => {
  const toasts = useToastList()

  return ReactDOM.createPortal(
    <Container>
      {toasts.map(({ key, ...t }) => (
        <Toast key={key} toastKey={key} {...t} />
      ))}
    </Container>,
    document.getElementById('toast') as HTMLElement
  )
}
export const ToastContainer = dynamic(
  () => Promise.resolve(RawToastContainer),
  {
    ssr: false,
  }
)
const Container = styled.div`
  position: absolute;
  z-index: 1000;
  left: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column-reverse;
  pointer-events: none;
  contain: layout;
`

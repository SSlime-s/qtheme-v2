import styled from '@emotion/styled'
import { useCallback, useState } from 'react'
import { BsClipboard, BsClipboardCheck, BsClipboardX } from 'react-icons/bs'

interface Props {
  text: string
  onClick?: () => void
  onCopy?: () => void
  onCopyError?: () => void
}
type CopyState = 'default' | 'copied' | 'error'
export const CopyButton: React.FC<
  Props & React.HTMLAttributes<HTMLButtonElement>
> = ({ text, onClick, onCopy, onCopyError, ...props }) => {
  const [status, setStatus] = useState<CopyState>('default')

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
      setTimeout(() => setStatus('default'), 700)
      onCopy?.()
    } catch (e) {
      setStatus('error')
      setTimeout(() => setStatus('default'), 700)
      onCopyError?.()
    }
  }, [text, onCopy, onCopyError])

  const handleClick = useCallback(() => {
    onClick?.()
    copy()
  }, [copy, onClick])

  return (
    <Button onClick={handleClick} status={status} {...props}>
      {status === 'default' ? (
        <BsClipboard />
      ) : status === 'copied' ? (
        <BsClipboardCheck />
      ) : (
        <BsClipboardX />
      )}
    </Button>
  )
}
const Button = styled.button<{
  status: CopyState
}>`
  color: ${({ theme, status }) =>
    status === 'default'
      ? theme.theme.basic.accent.primary.default
      : status === 'copied'
      ? theme.theme.basic.accent.online.default
      : theme.theme.basic.accent.error.default};
  transition: all 0.2s ease-out, transform 0.1s ease-out;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover {
    transform: scale(1.1);
  }
`

import styled from '@emotion/styled'
import { PropsWithChildren, useCallback } from 'react'
import { Modal } from './Modal'

interface DefaultModalProps extends React.ComponentProps<'div'> {
  onOutsideClick?: () => void
}
export const DefaultModal: React.FC<PropsWithChildren<DefaultModalProps>> = ({
  children,
  onOutsideClick,
  ...props
}) => {
  const handleOutsideClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onOutsideClick?.()
      }
    },
    [onOutsideClick]
  )

  return (
    <DefaultModalWrap onClick={handleOutsideClick}>
      <DefaultWrap {...props}>{children}</DefaultWrap>
    </DefaultModalWrap>
  )
}
const DefaultModalWrap = styled(Modal)`
  display: grid;
  place-items: center;
  padding: 16px;
  overflow: auto;
`
const DefaultWrap = styled.div`
  width: calc(100% - 32px);
  height: 80%;
  max-width: 640px;
  max-height: 480px;
`

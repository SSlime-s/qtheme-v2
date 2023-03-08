import { GlassmorphismStyle } from '@/components/Glassmorphism'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { PropsWithChildren, useCallback } from 'react'
import { Modal } from './Modal'

interface Props extends React.ComponentProps<'div'> {
  onOutsideClick?: () => void

  /**
   * GlassMorphism のような見た目にする
   *
   * @default false
   */
  glass?: boolean
  /**
   * traQ のよくあるモーダルのサイズにする
   *
   * @default false
   */
  defaultSize?: boolean
  /**
   * モーダルを中央に配置する
   *
   * @default true
   */
  centered?: boolean
}
export const ModalTemplate: React.FC<PropsWithChildren<Props>> = ({
  children,
  onOutsideClick,
  glass = false,
  defaultSize = false,
  centered = true,
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
    <WrapModal onClick={handleOutsideClick} centered={centered}>
      <Wrap {...props} glass={glass} defaultSize={defaultSize}>
        {children}
      </Wrap>
    </WrapModal>
  )
}
const WrapModal = styled(Modal)<{
  centered: boolean
}>`
  ${({ centered }) =>
    centered &&
    css`
      display: grid;
      place-items: center;
    `}
  padding: 16px;
  overflow: auto;
`
const Wrap = styled.div<{
  glass: boolean
  defaultSize: boolean
}>`
  ${({ glass }) => glass && GlassmorphismStyle}
  ${({ defaultSize }) =>
    defaultSize &&
    css`
      width: calc(100% - 32px);
      height: 80%;
      max-width: 640px;
      max-height: 480px;
    `}
`

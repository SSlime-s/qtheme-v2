import { ModalTemplate } from '@/utils/modal/ModalTemplate'
import { lightTheme } from '@/utils/theme/default'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

interface Props extends React.ComponentProps<'div'> {
  children?: never

  titleProps?: React.ComponentProps<'h1'>

  onOk: () => void
  onCancel: () => void
}
export const ConfirmModal: React.FC<Props> = ({
  titleProps,
  onOk,
  onCancel,
  ...props
}) => {
  return (
    <Wrap glass {...props}>
      <Title {...titleProps}>変更を保存せずに閉じますか？</Title>

      <ControlsWrap>
        <Button onClick={onCancel}>戻る</Button>
        <WarningButton onClick={onOk}>保存せず閉じる</WarningButton>
      </ControlsWrap>
    </Wrap>
  )
}

const popupKeyframes = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`
const Wrap = styled(ModalTemplate)`
  padding: 24px;
  display: grid;
  gap: 32px;
  animation: ${popupKeyframes} 0.2s ease-out;
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
`
const ControlsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`
const Button = styled.button`
  padding: 4px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  color: ${lightTheme.basic.ui.primary};
  backdrop-filter: blur(4px);
`
const WarningButton = styled(Button)`
  background-color: ${lightTheme.basic.accent.error};
  color: ${lightTheme.basic.background.primary};
`

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { BiPaint, BiWorld } from 'react-icons/bi'

import { ModalTemplate } from '@/utils/modal/ModalTemplate'
import { lightTheme } from '@repo/theme/default'

interface Props extends React.ComponentProps<'div'> {
  children?: never

  titleProps?: React.ComponentProps<'h1'>

  close: () => void
}
export const PublicDescriptionModal: React.FC<Props> = ({
  titleProps,
  close,
  ...props
}) => {
  return (
    <Wrap glass onOutsideClick={close} {...props}>
      <Title {...titleProps}>Public が推奨な理由</Title>
      <p>
        <ul>
          <Li>
            <Marker>
              <BiWorld />
            </Marker>
            traP 外の人にも見てもらうことができます
          </Li>
          <Li>
            <Marker>
              <BiPaint />
            </Marker>
            traQ にリンクが共有されたときに、テーマの概要がわかるようになります
          </Li>
        </ul>
      </p>
      <CloseButton onClick={close}>わかった！</CloseButton>
    </Wrap>
  )
}

const popupKeyframes = keyframes`
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
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
const CloseButton = styled.button`
  margin-left: auto;
  display: block;
  padding: 8px 16px;
  border-radius: 4px;
  background: ${lightTheme.basic.accent.primary};
  color: ${lightTheme.basic.background.primary};
  font-weight: bold;
  cursor: pointer;
`
const Li = styled.li`
  margin-bottom: 8px;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px;
  line-height: 32px;
`
const Marker = styled.span`
  width: 32px;
  height: 32px;
  font-size: 16px;
  display: grid;
  place-items: center;
`

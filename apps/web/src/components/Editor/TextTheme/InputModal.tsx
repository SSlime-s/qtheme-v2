import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { lightTheme } from '@repo/theme/default'
import { useCallback, useEffect, useRef, useState } from 'react'

import { AutoResizeTextarea } from '@/components/AutoResizeTextarea'
import { useAutoRestoreState } from '@/utils/autoRestoreState'
import { ModalTemplate } from '@/utils/modal/ModalTemplate'

import { wiggleElement } from './WiggleAnimation'

const checkValidJson = (value: string): boolean => {
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}
const format = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value), null, 2) + '\n'
  } catch (e) {
    return value
  }
}
const unformat = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value))
  } catch (e) {
    return value
  }
}

type State = 'idle' | 'failed'

interface Props extends React.ComponentProps<'div'> {
  children?: never

  onOutsideClick?: () => void
  titleProps?: React.ComponentProps<'h1'>

  value: string
  onClose: () => void
  onSave: (value: string) => boolean
  setNeedPreventClose?: (needPreventClose: boolean) => void
}
export const InputModal: React.FC<Props> = ({
  titleProps,
  value,
  onClose,
  onSave,
  setNeedPreventClose,
  ...props
}) => {
  const [innerValue, setInnerValue] = useState(format(value))
  useEffect(() => {
    setInnerValue(format(value))
    setNeedPreventClose?.(false)
  }, [setNeedPreventClose, value])

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInnerValue(e.target.value)
      setNeedPreventClose?.(value !== unformat(e.target.value))
    },
    [setNeedPreventClose, value]
  )

  const handleSave = useCallback((): boolean => {
    const success = onSave(unformat(innerValue))
    if (success) {
      onClose()
      return true
    }
    return false
  }, [innerValue, onClose, onSave])

  const formatButtonRef = useRef<HTMLButtonElement>(null)
  const [formatState, setFormatState] = useAutoRestoreState<State>('idle', 700)
  const handleFormat = useCallback((): boolean => {
    if (!checkValidJson(innerValue)) {
      setFormatState('failed')

      if (formatButtonRef.current !== null) {
        wiggleElement(formatButtonRef.current)
      }
      return false
    }
    setInnerValue(value => format(value))
    return true
  }, [innerValue, setFormatState])

  return (
    <Wrap {...props} glass defaultSize>
      <Inner>
        <Title {...titleProps}>テーマを入力</Title>
        <TextAreaWrap>
          <TextArea value={innerValue} onChange={onChange} className='mono' />
        </TextAreaWrap>
        <ControlsWrap>
          <FormatButton
            onClick={handleFormat}
            type='button'
            state={formatState}
            ref={formatButtonRef}
          >
            format
          </FormatButton>
          <Button onClick={onClose} type='button'>
            保存せず閉じる
          </Button>
          <SaveButton onClick={handleSave}>保存して閉じる</SaveButton>
        </ControlsWrap>
      </Inner>
    </Wrap>
  )
}
const popupKeyframes = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`
const Wrap = styled(ModalTemplate)`
  padding: 16px;
  animation: ${popupKeyframes} 0.3s ease-out;
`
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`
const Inner = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  gap: 16px;
`
const TextAreaWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  border: 1px solid ${lightTheme.basic.ui.tertiary};
  border-radius: 8px;
  backdrop-filter: blur(4px);

  &:focus-within {
    border-color: ${lightTheme.basic.accent.primary};
  }
`
const TextArea = styled(AutoResizeTextarea)`
  width: 100%;
  padding: 16px;
`

const ControlsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`
const Button = styled.button`
  cursor: pointer;
  padding: 8px 16px;
  backdrop-filter: blur(4px);
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  text-align: center;
  border-radius: 8px;

  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: ${lightTheme.basic.accent.primary};
  }
`
const FormatButton = styled(Button)<{ state: State }>`
  margin-right: auto;

  ${({ state }) =>
    state === 'failed' &&
    css`
      border-color: ${lightTheme.basic.accent.error};
      color: ${lightTheme.basic.accent.error};

      transition: all 0.2s ease-out;
      transition-property: border-color, color;

      &:focus {
        border-color: ${lightTheme.basic.accent.error};
      }
    `}
`
const SaveButton = styled(Button)`
  background-color: ${lightTheme.basic.accent.primary};
  color: ${lightTheme.basic.background.primary};

  &:focus {
    outline: none;
    border-color: ${lightTheme.basic.accent.primary};
  }
`

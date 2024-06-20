import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { BsCheckLg, BsXLg } from 'react-icons/bs'

import { themeSchema } from '@/model/theme'
import { lineClamp } from '@/styles/lineClamp'
import { useCheckedClipboard } from '@/utils/clipboard'
import { useConfirmModal } from '@/utils/modal/ConfirmModal/hooks'
import { useModal } from '@/utils/modal/useModal'
import { lightTheme } from '@/utils/theme/default'

import { ConfirmModal } from './ConfirmModal'
import { InputModal } from './InputModal'

import type { Form } from '@/components/Editor'

type CopyStatus = 'idle' | 'copied' | 'failed'
export const TextTheme: React.FC = () => {
  const { control, getValues, setValue, setError } = useFormContext<Form>()

  const [inputValue, setInputValue] = useState(
    JSON.stringify(getValues('theme'))
  )

  const [clipboard, setClipboard] = useCheckedClipboard()
  const isThemeCopying = useMemo(() => {
    if (clipboard === inputValue) {
      return false
    }

    let theme
    try {
      theme = JSON.parse(clipboard)
    } catch (e) {
      return false
    }

    return themeSchema.safeParse(theme).success
  }, [clipboard, inputValue])

  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')
  const copy = useCallback(async () => {
    const success = await setClipboard(inputValue)
    setCopyStatus(success ? 'copied' : 'failed')
    setTimeout(() => {
      setCopyStatus('idle')
    }, 700)
  }, [inputValue, setClipboard])

  const theme = useWatch({
    control,
    name: 'theme',
  })
  useEffect(() => {
    setInputValue(JSON.stringify(theme))
  }, [theme])

  const {
    isOpen: isConfirmOpen,
    waitConfirm,
    ok,
    cancel,
    modalProps: confirmModalProps,
  } = useConfirmModal('pages/edit/components/TextTheme/InputModal/confirm')

  const isPreventCloseRef = useRef(false)
  const preventClose = useCallback(async () => {
    const needPrevent = isPreventCloseRef.current
    if (needPrevent) {
      const confirmed = await waitConfirm()
      if (confirmed) {
        isPreventCloseRef.current = false
        return true
      }
    }
    return !needPrevent
  }, [waitConfirm])
  const setNeedPreventClose = useCallback((needPreventClose: boolean) => {
    isPreventCloseRef.current = needPreventClose
  }, [])
  const { isOpen, open, close, triggerRef, modalProps, titleProps, titleRef } =
    useModal('pages/edit/components/TextTheme/InputModal', preventClose)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleUnload = async (e: BeforeUnloadEvent) => {
      if (isPreventCloseRef.current) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [isOpen])

  const handleChange = useCallback(
    (value: string): boolean => {
      setInputValue(value)

      let parsedValue: object
      try {
        parsedValue = JSON.parse(value)
      } catch (e) {
        setError('theme', {
          type: 'validate',
          message: `テーマの形式が不正です: ${e}`,
        })
        return false
      }

      if (themeSchema.safeParse(parsedValue).success) {
        setValue('theme', JSON.parse(value), {
          shouldValidate: true,
          shouldDirty: true,
        })
        isPreventCloseRef.current = false
        return true
      } else {
        setError('theme', {
          type: 'validate',
          message: 'テーマの形式が不正です',
        })
        return false
      }
    },
    [setError, setValue]
  )

  return (
    <Wrap>
      <Title>Input / Output</Title>
      <ImportButton
        hidden={!isThemeCopying}
        onClick={handleChange.bind(null, clipboard)}
      >
        クリップボードからインポート
      </ImportButton>

      <TextsWrap>
        <InputButton ref={triggerRef} onClick={open}>
          <InputButtonContent>{inputValue}</InputButtonContent>
        </InputButton>

        <CopyButton onClick={copy} status={copyStatus}>
          <LogicalHidden hidden={copyStatus !== 'idle'}>Copy</LogicalHidden>
          {copyStatus === 'copied' && <BsCheckLg />}
          {copyStatus === 'failed' && <BsXLg />}
        </CopyButton>
      </TextsWrap>

      {isOpen && (
        <InputModal
          {...modalProps}
          onOutsideClick={close}
          titleProps={{
            ...titleProps,
            ref: titleRef,
          }}
          value={inputValue}
          onClose={close}
          onSave={handleChange}
          setNeedPreventClose={setNeedPreventClose}
        />
      )}

      {isConfirmOpen && (
        <ConfirmModal {...confirmModalProps} onOk={ok} onCancel={cancel} />
      )}
    </Wrap>
  )
}

const Wrap = styled.div``
const Title = styled.h2``
const ImportButton = styled.button`
  cursor: pointer;

  &[hidden] {
    display: block;
    visibility: hidden;
  }
`

const TextsWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 16px;
`
const InputButton = styled.button`
  cursor: pointer;
`
const InputButtonContent = styled.div`
  ${lineClamp(1)}

  word-break: break-all;
  overflow-wrap: normal;

  border: 1px solid ${lightTheme.basic.ui.tertiary};
  *:focus > & {
    border-color: ${lightTheme.basic.accent.primary};
  }
  border-radius: 4px;
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  color: ${lightTheme.basic.ui.secondary};
`
const FailKeyframe = keyframes`
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(8px);
  }
  50% {
    transform: translateX(-8px);
  }
  75% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
`
const CopyButton = styled.button<{ status: CopyStatus }>`
  cursor: pointer;
  display: grid;
  & > * {
    grid-area: 1 / 1;
  }
  place-items: center;
  text-transform: uppercase;
  transition: all 0.2s ease-out;
  transition-property: border-color, opacity;

  border: 1px solid ${lightTheme.basic.ui.tertiary};
  border-radius: 4px;
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  color: ${({ status }) =>
    status === 'idle'
      ? lightTheme.basic.ui.primary
      : lightTheme.basic.background.primary};
  background-color: ${({ status }) =>
    status === 'idle'
      ? lightTheme.basic.background.primary
      : status === 'copied'
      ? lightTheme.basic.accent.online
      : lightTheme.basic.accent.error};
  opacity: ${({ status }) => (status === 'idle' ? 1 : 0.6)};

  ${({ status }) =>
    status === 'failed' &&
    css`
      animation: ${FailKeyframe} 0.3s ease-out;
    `}

  &:focus {
    border-color: ${lightTheme.basic.accent.primary};
  }
`
const LogicalHidden = styled.span`
  grid-area: 1 / 1;

  &[hidden] {
    display: block;
    visibility: hidden;
  }
`

import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import {
  PropsWithChildren,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'

export const useModal = <
  TitleElement extends HTMLElement = HTMLHeadingElement,
  TriggerElement extends HTMLElement = HTMLButtonElement
>() => {
  const titleRef = useRef<TitleElement>(null)
  const triggerRef = useRef<TriggerElement>(null)

  const titleId = useId()

  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => {
    setIsOpen(true)
    titleRef?.current?.focus()
  }, [])
  const close = useCallback(() => {
    setIsOpen(false)
    triggerRef?.current?.focus()
  }, [])
  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        triggerRef?.current?.focus()
      } else {
        titleRef?.current?.focus()
      }

      return !prev
    })
  }, [])

  const modalProps = useMemo(() => {
    return {
      'aria-modal': isOpen,
      'aria-labelledby': titleId,
      role: 'dialog',
    }
  }, [isOpen, titleId])

  const titleProps = useMemo(() => {
    return {
      id: titleId,
    }
  }, [titleId])

  return {
    isOpen,
    open,
    close,
    toggle,
    modalProps,
    titleProps,
    titleRef,
    triggerRef,
  }
}

const ModalPortalRaw: React.FC<PropsWithChildren> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}
const ModalPortal = dynamic(() => Promise.resolve(ModalPortalRaw), {
  ssr: false,
})

export const Modal: React.FC<
  PropsWithChildren<React.ComponentProps<'div'>>
> = ({ children, ...props }) => {
  return (
    <ModalPortal>
      <Overlay {...props}>{children}</Overlay>
    </ModalPortal>
  )
}
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #00000026;
  z-index: 1000;
`

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

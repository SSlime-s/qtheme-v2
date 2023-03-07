import { useCallback, useId, useMemo, useRef, useState } from 'react'

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

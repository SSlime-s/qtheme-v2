import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

export const useModal = <
  TitleElement extends HTMLElement = HTMLHeadingElement,
  TriggerElement extends HTMLElement = HTMLButtonElement
>(
  id: string
) => {
  const titleRef = useRef<TitleElement>(null)
  const triggerRef = useRef<TriggerElement>(null)

  const titleId = useId()

  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => {
    setIsOpen(true)
    titleRef?.current?.focus()

    history.pushState(
      {
        ...history.state,
        modalId: id,
      },
      ''
    )
  }, [id])
  const close = useCallback(async () => {
    history.back()

    await new Promise<void>(resolve => {
      window.addEventListener(
        'popstate',
        e => {
          console.log('35', e, e.state.modalId)
          resolve()
        },
        { once: true }
      )
    })

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

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.modalId === id) {
        setIsOpen(true)
        return
      }
      setIsOpen(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [close, id])

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

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

export const useAccordion = <E extends HTMLElement = HTMLDivElement>(
  contentMargin = 0
) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = useId()
  const ref = useRef<E>(null)

  const [contentHeight, setContentHeight] = useState<number>()

  const toggle = useCallback(() => {
    setIsOpen(isOpen => !isOpen)
  }, [])
  const open = useCallback(() => {
    setIsOpen(true)
  }, [])
  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (ref.current === null) {
      return
    }

    const content = ref.current
    const setHeight = () => {
      setContentHeight(content.scrollHeight + contentMargin)
    }

    setHeight()
    const observer = new ResizeObserver(setHeight)
    observer.observe(content)

    return () => {
      observer.disconnect()
    }
  }, [contentMargin])

  const ariaToggle = useMemo(() => {
    return {
      'aria-controls': contentId,
      'aria-expanded': isOpen,
    }
  }, [contentId, isOpen])
  const ariaContent = useMemo(() => {
    return {
      id: contentId,
      // FIXME: ページ内検索で引っかからないように hidden もつけるべき
      'aria-hidden': !isOpen,
    }
  }, [contentId, isOpen])

  return {
    isOpen,
    toggle,
    open,
    close,
    contentRef: ref,
    contentHeight,
    ariaToggle,
    ariaContent,
  }
}

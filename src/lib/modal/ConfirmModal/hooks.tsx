import { useCallback, useState } from 'react'
import { useModal } from '../useModal'

interface Resolve {
  resolve: (value: boolean) => void
}
export const useConfirmModal = (id: string) => {
  // const [isOpen, setIsOpen] = useState(false)
  const [resolve, setResolve] = useState<Resolve>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    resolve: () => {},
  })
  const { isOpen, open, close, modalProps, titleProps, titleRef, triggerRef } =
    useModal(id)

  const waitConfirm = useCallback(() => {
    const promise = new Promise<boolean>(resolve => {
      setResolve({ resolve })
      open()
    })
    return promise
  }, [open])

  const ok = useCallback(() => {
    resolve.resolve(true)
    void close()
  }, [close, resolve])
  const cancel = useCallback(() => {
    resolve.resolve(false)
    void close()
  }, [close, resolve])

  return {
    isOpen,
    waitConfirm,
    ok,
    cancel,

    modalProps,
    titleProps,
    titleRef,
    triggerRef,
  }
}

import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'

export const useBlockLeave = (isBlock: boolean) => {
  const abortController = useMemo(() => new AbortController(), [])

  // ブラウザネイティブの離脱をブロック
  useEffect(() => {
    if (!isBlock) {
      return
    }
    const handleUnload = async (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleUnload, {
      signal: abortController.signal,
    })
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [abortController.signal, isBlock])

  // Next.js のルーティングをブロック
  const router = useRouter()
  useEffect(() => {
    if (!isBlock) {
      return
    }

    const handleRouteChange = (to: string) => {
      if (to === router.asPath) {
        return
      }
      if (!confirm('離脱してもよろしいですか? (変更は保存されません)')) {
        router.events.emit('routeChangeError')
        throw 'routeChange aborted.'
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    const abort = () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    abortController.signal.addEventListener('abort', abort)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      abortController.signal.removeEventListener('abort', abort)
    }
  }, [abortController.signal, isBlock, router])

  const unbind = useCallback(() => {
    abortController.abort()
  }, [abortController])

  return {
    unbind,
  }
}

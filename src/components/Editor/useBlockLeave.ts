import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useBlockLeave = (isBlock: boolean) => {
  // ブラウザネイティブの離脱をブロック
  useEffect(() => {
    if (!isBlock) {
      return
    }
    const handleUnload = async (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [isBlock])

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
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [isBlock, router])
}

import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const pageLoadingAtom = atom(false)

export const usePageLoading = () => {
  const router = useRouter()
  const [isPageLoading, setPageLoading] = useAtom(pageLoadingAtom)

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setPageLoading(true)
      }
    }
    const handleComplete = () => {
      setPageLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router, setPageLoading])

  return isPageLoading
}

import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const useLoginUrl = (redirectTo?: string) => {
  const router = useRouter()
  const redirect = useMemo(() => {
    return encodeURIComponent(redirectTo ?? router.asPath)
  }, [redirectTo, router.asPath])

  return `https://qtheme-v2.trap.games/_oauth/login?redirect=${redirect}`
}

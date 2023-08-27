import { useEffect, useMemo, useState } from 'react'

export const useLoginUrl = (redirectTo?: string) => {
  const [now, setNow] = useState('')
  useEffect(() => {
    setNow(window.location.href)
  }, [])

  const redirect = useMemo(() => {
    return encodeURIComponent(redirectTo ?? now ?? '')
  }, [redirectTo, now])

  return `https://qtheme-v2.trap.games/_oauth/login?redirect=${redirect}`
}

import { useEffect, useState } from 'react'

const mobileBreakpoint = 992
export const useIsMobile = () => {
  const matchQuery: MediaQueryList | undefined =
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)
      : undefined

  const [isMobile, setIsMobile] = useState(matchQuery?.matches ?? false)

  useEffect(() => {
    if (matchQuery === undefined) return
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    matchQuery.addEventListener('change', handler)
    return () => matchQuery.removeEventListener('change', handler)
  }, [matchQuery])

  return isMobile
}
export const isMobile = `@media (max-width: ${mobileBreakpoint}px)` as const

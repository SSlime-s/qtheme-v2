import { useEffect, useState } from "react"

export const useIsMobile = () => {
  const matchQuery = window.matchMedia('(max-width: 768px)')

  const [isMobile, setIsMobile] = useState(matchQuery.matches)

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    matchQuery.addEventListener('change', handler)
    return () => matchQuery.removeEventListener('change', handler)
  }, [matchQuery])

  return isMobile
}

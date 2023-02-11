import { useIsMobile } from '@/lib/isMobile'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'

export const Sidebar: React.FC = () => {
  const isMobile = useIsMobile()
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (ref.current === null) return
    if (!isMobile) return

    setIsOpen(false)
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.6) {
            setIsOpen(true)
          } else {
            setIsOpen(false)
          }
        }
      },
      {
        root: null,
        threshold: [0, 0.4, 0.6],
      }
    )
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [isMobile, ref])

  return (
    <>
      <Cover hidden={!isOpen} />
      <Wrap ref={ref}>Sidebar</Wrap>
    </>
  )
}

const Wrap = styled.aside`
  grid-area: side;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};

  @media (max-width: 992px) {
    position: relative;
    z-index: 30;
    scroll-snap-align: end;
  }
`

const Cover = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: rgba(25, 26, 29, 0.5);
  opacity: 0;
  height: 100vh;
  width: 100vw;
  transition: opacity 0.2s ease-in-out;
  z-index: 29;
  display: none;

  @media (max-width: 992px) {
    display: block;
    opacity: 1;

    &[hidden] {
      opacity: 0;
    }
  }
`

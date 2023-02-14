import { isMobile, useIsMobile } from '@/lib/isMobile'
import styled from '@emotion/styled'
import Link from 'next/link'
import path from 'path'
import { useCallback, useMemo, useRef } from 'react'

interface Props {
  /**
   *  #favorite/light なら ['favorite', 'light']
   */
  channelPath: string[]
}

interface Path {
  name: string
  href: string
}

export const Header: React.FC<Props> = ({ channelPath }) => {
  const isMobile = useIsMobile()
  const now: Path | undefined = useMemo(() => {
    const name = channelPath[channelPath.length - 1]
    if (name === undefined) return undefined
    return {
      name,
      href: path.join('/', channelPath.join('/')),
    }
  }, [channelPath])

  const root: Path | undefined = useMemo(() => {
    const name = channelPath[0]
    if (name === undefined) return undefined
    return {
      name,
      href: path.join('/', name),
    }
  }, [channelPath])

  const rest: Path[] = useMemo(() => {
    const rest = channelPath.slice(1, -1)
    const res: Path[] = []
    rest.forEach((name, i) => {
      if (i === 0) {
        res.push({
          name,
          href: path.join('/', name),
        })
      } else {
        res.push({
          name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          href: path.join(res[res.length - 1].href, name),
        })
      }
    })
    return res
  }, [channelPath])

  const isRoot = useMemo(() => {
    return channelPath.length === 1
  }, [channelPath])

  const ref = useRef<HTMLDivElement>(null)
  const scrollToSelf = useCallback(() => {
    if (!isMobile) {
      return
    }
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [isMobile])

  // return <Wrap>#favorite/path</Wrap>
  return (
    <>
      <DummyWrap ref={ref} />
      <Wrap onClickCapture={scrollToSelf}>
        <PathWrap>
          {isRoot ? (
            <NowPath>
              <HashWrap>#</HashWrap>
              {now?.name}
            </NowPath>
          ) : (
            <>
              <RestPath>
                <RootLink href={root?.href ?? '/'}>
                  <HashWrap>#</HashWrap>
                  {root?.name}
                </RootLink>
                <Separator />
              </RestPath>
              {rest.map(path => {
                return (
                  <RestPath key={path.href}>
                    <Link href={path.href}>{path.name}</Link>
                    <Separator />
                  </RestPath>
                )
              })}
              <NowPath>{now?.name}</NowPath>
            </>
          )}
        </PathWrap>
      </Wrap>
    </>
  )
}
const Separator: React.FC = () => {
  return <SeparatorWrap>/</SeparatorWrap>
}

const Wrap = styled.header`
  grid-area: header;
  background: ${({ theme }) => theme.theme.basic.background.primary.default};
  border-bottom: solid 2px
    ${({ theme }) => theme.theme.basic.ui.tertiary.default};
  display: grid;
  align-items: center;
  padding: 16px;

  ${isMobile} {
    position: sticky;
    left: 0;
    z-index: 20;
  }
`
const DummyWrap = styled.div`
  grid-area: header;
  display: hidden;

  ${isMobile}  {
    display: block;
    pointer-events: none;
    scroll-snap-align: start;
  }
`
const PathWrap = styled.div`
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  user-select: none;
  font-weight: bold;
`
const HashWrap = styled.span`
  font-size: 1.5rem;
  margin-right: 0.125rem;
`
const RootLink = styled(Link)``
const NowPath = styled.span`
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  font-size: 1.5rem;
  margin-left: 0.125rem;
`
const RestPath = styled.span`
  color: ${({ theme }) => theme.theme.basic.ui.secondary.inactive};
  font-size: 1rem;

  & > a:hover {
    color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
    transition: color 0.1s;
  }
`
const SeparatorWrap = styled.span`
  color: ${({ theme }) => theme.theme.basic.ui.secondary.inactive};
  font-size: 1rem;
  margin: 0 0.125rem;
`

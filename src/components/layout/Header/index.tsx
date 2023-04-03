import { isMobile, useIsMobile } from '@/utils/isMobile'
import styled from '@emotion/styled'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import Link from 'next/link'
import { useCallback, useMemo, useRef } from 'react'
import { ChannelPath } from './convertChannelPath'
import Image from 'next/image'
import Logo from '@/assets/QTheme.png'

interface Props {
  channelPath: ChannelPath[]
  openNavBar: () => void
}

const topicAtom = atom<string | null>(null)
export const useSetTopic = () => {
  return useSetAtom(topicAtom)
}
export const Header: React.FC<Props> = ({ channelPath, openNavBar }) => {
  const isMobile = useIsMobile()

  const topic = useAtomValue(topicAtom)

  const now: ChannelPath | undefined = useMemo(() => {
    const pathElement = channelPath[channelPath.length - 1]
    if (pathElement === undefined) return undefined
    return pathElement
  }, [channelPath])

  const root: ChannelPath | undefined = useMemo(() => {
    const pathElement = channelPath[0]
    if (pathElement === undefined) return undefined
    return pathElement
  }, [channelPath])

  const rest: ChannelPath[] = useMemo(() => {
    return channelPath.slice(1, -1)
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
        <MenuButton onClick={openNavBar} hidden={!isMobile}>
          <Image src={Logo} alt='Open NavBar' width={24} height={24} />
        </MenuButton>
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
        {topic !== null && <Topic>{topic}</Topic>}
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
  display: flex;
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

  ${isMobile} {
    display: block;
    pointer-events: none;
    scroll-snap-align: start;
  }
`
const MenuButton = styled.button`
  margin-right: 8px;
  height: 36px;
  cursor: pointer;

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.theme.basic.accent.primary.default};
  }

  &[hidden] {
    display: none;
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
const Topic = styled.div`
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  height: 16px;
  margin-left: 16px;
  padding: 0 16px;
  border-left: 2px solid ${({ theme }) => theme.theme.basic.ui.tertiary.default};
  font-size: 0.875rem;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 16px;
`

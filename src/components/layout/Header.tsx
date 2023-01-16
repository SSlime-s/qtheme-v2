import styled from '@emotion/styled'
import Link from 'next/link'
import path from 'path'
import { useMemo } from 'react'

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
  const basePath = useMemo(() => {
    return process.env.BASE_URL ?? ''
  }, [])

  const now: Path | undefined = useMemo(() => {
    const name = channelPath.at(-1)
    if (name === undefined) return undefined
    return {
      name,
      href: path.join(basePath, channelPath.join('/')),
    }
  }, [basePath, channelPath])

  const root: Path | undefined = useMemo(() => {
    const name = channelPath.at(0)
    if (name === undefined) return undefined
    return {
      name,
      href: path.join(basePath, name),
    }
  }, [basePath, channelPath])

  const rest: Path[] = useMemo(() => {
    const rest = channelPath.slice(1, -1)
    const res: Path[] = []
    rest.forEach((name, i) => {
      if (i == 0) {
        res.push({
          name,
          href: path.join(basePath, name),
        })
      } else {
        res.push({
          name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          href: path.join(res.at(-1)!.href, name),
        })
      }
    })
    return res
  }, [basePath, channelPath])

  const isRoot = useMemo(() => {
    return channelPath.length === 1
  }, [channelPath])

  // return <Wrap>#favorite/path</Wrap>
  return (
    <Wrap>
      <PathWrap>
        <RestPath>
          <RootLink href={root?.href ?? '/'}>
            <HashWrap root={isRoot}>#</HashWrap>
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
      </PathWrap>
    </Wrap>
  )
}
const Separator: React.FC = () => {
  return <SeparatorWrap>/</SeparatorWrap>
}

const Wrap = styled.div`
  grid-area: header;
  background: ${({ theme }) => theme.theme.basic.background.primary.default};
  border-bottom: solid 2px
    ${({ theme }) => theme.theme.basic.ui.tertiary.default};
  display: grid;
  align-items: center;
  padding: 16px;
`
const PathWrap = styled.div`
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  user-select: none;
  font-weight: bold;
`
const HashWrap = styled.span<{ root: boolean }>`
  color: ${({ theme, root }) =>
    root ? theme.theme.basic.ui.primary.default : 'inherit'};
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

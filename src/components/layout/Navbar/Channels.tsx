import {
  Channel,
  ChannelAccordion,
} from '@/components/layout/components/ChannelAccordion'
import { ReadonlyTree, Tree } from '@/lib/typeUtils'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import path from 'path'
import { useMemo } from 'react'

const lightDark = [
  {
    value: 'light',
  },
  {
    value: 'dark',
  },
] as const satisfies ReadonlyTree<string>['children']
const loginHome = [
  {
    value: 'favorite',
    children: lightDark,
  },
] as const satisfies readonly ReadonlyTree<string>[]
const channels = [
  {
    value: 'random',
    children: lightDark,
  },
  {
    value: 'all',
    children: lightDark,
  },
] as const satisfies readonly ReadonlyTree<string>[]

export const NavbarChannels: React.FC = () => {
  return (
    <Wrap>
      <ChannelGroup name='ホーム' channelNames={loginHome} />
      <ChannelGroup name='チャンネル' channelNames={channels} />
    </Wrap>
  )
}
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

interface ChannelInfo {
  name: string
  href: string
}
const urlResolver = (
  channelNames: ReadonlyTree<string>,
  base = '/'
): Tree<ChannelInfo> => {
  const now = {
    name: channelNames.value,
    href: path.join(base, channelNames.value),
  }
  return {
    value: now,
    children: channelNames.children?.map(child => {
      return urlResolver(child, path.join(base, now.href))
    }),
  }
}

interface ChannelGroup {
  name: string
  channelNames: readonly ReadonlyTree<string>[]
}
const ChannelGroup: React.FC<ChannelGroup> = ({ name, channelNames }) => {
  const channelTree = useMemo(() => {
    return channelNames.map(c => urlResolver(c))
  }, [channelNames])

  return (
    <ChannelGroupWrap>
      <ChannelGroupLabel>{name}</ChannelGroupLabel>
      <ChannelGroupContent>
        {channelTree.map(c => {
          return <Channels key={c.value.href} {...c} />
        })}
      </ChannelGroupContent>
    </ChannelGroupWrap>
  )
}
const ChannelGroupWrap = styled.div`
  display: flex;
  flex-direction: column;
`
const ChannelGroupLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
`
const ChannelGroupContent = styled.div`
  margin-top: 0.5rem;
`

const Channels: React.FC<ReadonlyTree<ChannelInfo>> = ({ value, children }) => {
  const { asPath } = useRouter()

  if (children === undefined || children.length === 0) {
    return (
      <Channel
        name={value.name}
        to={value.href}
        selected={asPath === value.href}
      />
    )
  }

  return (
    <ChannelAccordion
      name={value.name}
      to={value.href}
      selected={asPath === value.href}
    >
      {children.map(child => {
        return <Channels key={child.value.href} {...child} />
      })}
    </ChannelAccordion>
  )
}

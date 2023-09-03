import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'

import { Error } from '@/components/Error'
import { Skeleton } from '@/components/LoadingBar'
import { userIconUrl } from '@/utils/api'

import { useAuthors } from './useAuthors'

export const NavbarUsers: React.FC = () => {
  const { data, error, isLoading } = useAuthors()

  if (isLoading) {
    return (
      <Wrap>
        {Array.from({ length: 8 }, (_, i) => (
          <UserSkeleton key={i} />
        ))}
      </Wrap>
    )
  }

  if (error !== undefined) {
    return (
      <Wrap>
        <Error statusCode={500} />
      </Wrap>
    )
  }

  if (data === undefined || data.length === 0) {
    return <Wrap>ユーザーがいません</Wrap>
  }

  return (
    <Wrap>
      {data.map(({ name, count }) => (
        <UserCard key={name} name={name} count={count} />
      ))}
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`

const UserCard: React.FC<{
  name: string
  count: number
}> = ({ name, count }) => {
  return (
    <CardWrap href={`/user/${name}`}>
      <Icon src={userIconUrl(name)} alt='' width={36} height={36} />
      <Name>{name}</Name>
      <Count>{count}投稿</Count>
    </CardWrap>
  )
}
const UserSkeleton: React.FC = () => {
  return (
    <CardWrapSkelton
      tabIndex={0}
      role='progressbar'
      aria-busy={true}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext='Loading...'
    >
      <Skeleton
        width='36px'
        height='36px'
        borderRadius='9999px'
        css={css`
          grid-area: icon;
        `}
      />
      <Skeleton
        width='100px'
        height='14px'
        borderRadius='9999px'
        css={css`
          grid-area: name;
        `}
      />
      <Skeleton
        width='40px'
        height='12px'
        borderRadius='9999px'
        css={css`
          grid-area: count;
          align-self: flex-end;
        `}
      />
    </CardWrapSkelton>
  )
}
const CardBaseStyle = css`
  display: grid;
  grid-template-areas:
    'icon name'
    'icon count';
  grid-template-columns: 36px 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 16px;
  padding: 4px 8px;
  margin: 0 -8px;
  border-radius: 4px;
`
const CardWrap = styled(Link)`
  ${CardBaseStyle}

  box-shadow: inset 0 0 4px -1px transparent;
  transition: box-shadow 0.2s ease-out;
  &:hover {
    box-shadow: inset 0 0 4px -1px ${({ theme }) => theme.theme.basic.ui.primary.default};
  }

  &:focus {
    outline: 1px solid
      ${({ theme }) => theme.theme.basic.accent.primary.default};
  }
`
const CardWrapSkelton = styled.div`
  ${CardBaseStyle}

  justify-content: center;
`
const Icon = styled(Image)`
  grid-area: icon;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  place-self: center;
`
const Name = styled.div`
  grid-area: name;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: flex-end;
`
const Count = styled.div`
  grid-area: count;
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: flex-start;
`

import { userIconUrl } from '@/utils/api'
import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthors } from './useAuthors'

export const NavbarUsers: React.FC = () => {
  const { data, error, isLoading } = useAuthors()

  if (isLoading) {
    return <Wrap>Loading</Wrap>
  }

  if (error) {
    return <Wrap>Error</Wrap>
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
const CardWrap = styled(Link)`
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

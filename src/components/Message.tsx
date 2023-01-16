import { userIconUrl } from '@/lib/api'
import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  iconUser: string
  name?: string
  tag: string
  date: string
  content: React.ReactNode
  stamps?: React.ReactNode
}

export const Message = ({
  iconUser,
  name: nameRaw,
  tag,
  date,
  content,
  stamps,
}: Props) => {
  const name = nameRaw ?? iconUser

  return (
    <Wrap>
      <Icon href={/* TODO */ '#'}>
        {/* <Image src={userIconUrl(iconUser)} alt={name} width={40} height={40} /> */}
        <img src={userIconUrl(iconUser)} alt={name} width={40} height={40} />
      </Icon>
      <Header>
        <NameWrap>{name}</NameWrap>
        <TagWrap>{tag}</TagWrap>
        <DateWrap>{date}</DateWrap>
      </Header>
      <Content>{content}</Content>
      {stamps !== undefined ? <Stamps>{stamps}</Stamps> : null}
    </Wrap>
  )
}

const Wrap = styled.div`
  display: grid;
  grid-template-areas: 'icon header' 'icon content' '... content' '... stamps';
  grid-template-columns: 40px 1fr;
  grid-template-rows: 20px auto 1fr fit-content;
  content: contain;
  padding: 8px 32px;
  overflow: clip;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.theme.specific.messageHoverBackground};
  }
`
const Icon = styled(Link)`
  grid-area: icon;
  height: 40px;
  width: 40px;
  border-radius: 9999px;
  overflow: hidden;
`
const Header = styled.div`
  grid-area: header;
  margin-left: 8px;
  display: flex;
  align-items: baseline;
  gap: 4px;
`
const NameWrap = styled.span`
  font-weight: bold;
  flex: 2;
  max-width: min-content;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
`
const TagWrap = styled.span`
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  font-size: 0.875rem;
  display: inline-grid;
  place-items: center;
  font-weight: bold;
  padding: 0 4px;
  border-radius: 4px;
`
const DateWrap = styled.span`
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  font-size: 0.75rem;
`
const Content = styled.div`
  grid-area: content;
  margin-top: 4px;
  margin-left: 8px;
`
const Stamps = styled.div`
  grid-area: stamps;
  margin-top: 8px;
`

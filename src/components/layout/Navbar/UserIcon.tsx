import { HiOutlineExternalLink } from 'react-icons/hi'
import { FaRegUserCircle, FaLock } from 'react-icons/fa'
import { MdClose, MdFavorite, MdNavigateNext } from 'react-icons/md'
import { BiWorld } from 'react-icons/bi'

import { useModal } from '@/utils/modal/useModal'
import { ModalTemplate } from '@/utils/modal/ModalTemplate'
import styled from '@emotion/styled'
import { lightTheme } from '@/utils/theme/default'
import { userIconUrl } from '@/utils/api'

interface Props {
  userId?: string
}
export const UserIcon: React.FC<Props> = ({ userId }) => {
  const { isOpen, open, close, modalProps, titleProps, titleRef, triggerRef } =
    useModal('layout/Navbar/User')

  if (userId !== undefined) {
    return (
      <UserIconImage src={userIconUrl(userId)} />
    )
  }

  return (
    <>
      <UserIconButton onClick={open} ref={triggerRef}>
        <FaRegUserCircle />
      </UserIconButton>

      {isOpen && (
        <Wrap {...modalProps} onOutsideClick={close} glass>
          <Header>
            <Title {...titleProps} ref={titleRef}>
              traP部員になると？
            </Title>

            <CloseButton onClick={close}>
              <MdClose />
            </CloseButton>
          </Header>

          <Ol>
            <Li>
              <Marker>
                <BiWorld />
              </Marker>
              作成したテーマを保存し、公開することができます
            </Li>
            <Li>
              <Marker>
                <FaLock />
              </Marker>
              部員限定のテーマを見れるようになります
            </Li>
            <Li>
              <Marker>
                <MdFavorite />
              </Marker>
              他の人が作成したテーマをお気に入りに登録し、あとから見返すことができます
            </Li>
          </Ol>

          <Link href='https://trap.jp/about/' target='_blank' rel='noreferrer'>
            traPとは
            <HiOutlineExternalLink />
          </Link>

          <LoginButton
            href={`https://portal.trap.jp/pipeline?redirect=${
              window?.location.href ?? ''
            }`}
          >
            すでに部員の方はこちら
            <MdNavigateNext />
          </LoginButton>
        </Wrap>
      )}
    </>
  )
}
const UserIconImage = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 9999px;
`

const UserIconButton = styled.button`
  height: 36px;
  width: 36px;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.theme.basic.ui.secondary.inactive};
`

const Wrap = styled(ModalTemplate)`
  width: 100%;
  max-width: 640px;

  padding: 32px;

  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: 16px;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
`
const CloseButton = styled.button`
  height: 36px;
  width: 36px;
  font-size: 36px;
  cursor: pointer;
  background: transparent;
  color: ${lightTheme.basic.ui.secondary};

  transition: all 0.2s ease-out;

  &:hover {
    transform: scale(1.1);
    color: ${lightTheme.basic.ui.primary};
  }

  &:focus {
    outline: 1px solid ${lightTheme.basic.accent.primary};
  }
`

const Ol = styled.ol``
const Li = styled.li`
  margin-bottom: 8px;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px;
  line-height: 32px;
`
const Marker = styled.span`
  width: 32px;
  height: 32px;
  font-size: 16px;
  display: grid;
  place-items: center;
`

const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;

  backdrop-filter: blur(4px);
  margin-right: auto;
`

const LoginButton = styled.a`
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 8px 16px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  margin-right: auto;

  transition: all 0.2s ease-out;

  &:hover {
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
    transform: scale(1.025);
  }

  &:focus {
    outline: 1px solid ${lightTheme.basic.accent.primary};
  }
`

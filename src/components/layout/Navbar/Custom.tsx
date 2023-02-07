import Link from 'next/link'
import styled from '@emotion/styled'
import { BiImport } from 'react-icons/bi'
import { TbNewSection } from 'react-icons/tb'
import { css } from '@emotion/react'
import { useCurrentTheme } from '@/lib/theme/hooks'

export const NavbarCustom: React.FC = () => {
  const { currentRawTheme } = useCurrentTheme()

  return (
    <Wrap>
      <BigButton
        href={{
          pathname: '/edit',
          query: {
            new: '',
          },
        }}
      >
        <TbNewSection css={IconStyle} />
        新規テーマ作成
      </BigButton>
      <BigButton
        href={{
          pathname: '/edit',
          query: {
            init: JSON.stringify(currentRawTheme),
            new: '',
          },
        }}
      >
        <BiImport css={IconStyle} />
        現在のテーマから作成
      </BigButton>
    </Wrap>
  )
}
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const IconStyle = css`
  font-size: 1.5rem;
`
const BigButton = styled(Link)`
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  background: ${({ theme }) => theme.theme.basic.background.primary.default};
  width: 100%;
  padding: 12px 16px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  gap: 4px;
  align-items: center;
`

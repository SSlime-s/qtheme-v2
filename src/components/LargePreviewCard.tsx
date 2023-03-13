import { ResolvedTheme } from '@/utils/theme'
import { lightTheme } from '@/utils/theme/default'
import { FormattedTheme } from '@/utils/theme/hooks'
import styled from '@emotion/styled'
import { useCallback } from 'react'
import { GlassmorphismStyle } from './Glassmorphism'
import { SmallPreview } from './preview'

interface Props {
  theme: FormattedTheme
  resolvedTheme: ResolvedTheme
  changeTheme: (id: string, theme: FormattedTheme) => void
}
export const LargePreviewCard: React.FC<Props> = ({
  theme,
  resolvedTheme,
  changeTheme,
}) => {
  const changeHandler = useCallback(() => {
    changeTheme(theme.id, theme)
  }, [changeTheme, theme])

  return (
    <Card>
      <CardInner>
        <SmallPreview theme={resolvedTheme} author={theme.author} />
        <ChangeCurrentButton onClick={changeHandler}>
          <span>change current to this</span>
        </ChangeCurrentButton>
      </CardInner>
    </Card>
  )
}

const Card = styled.div`
  ${GlassmorphismStyle}

  padding: 32px;
  margin: 32px auto;
  max-width: 600px;
  width: 100%;
`
const CardInner = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
`
const ChangeCurrentButton = styled.button`
  cursor: pointer;
  display: grid;
  place-items: center;
  width: 100%;
  padding: 8px 0;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid ${lightTheme.basic.ui.tertiary};
  backdrop-filter: blur(2px);
  color: ${lightTheme.basic.ui.primary};

  & > span {
    transition: transform 0.2s;
  }
  &:hover > span {
    transform: scale(1.05);
  }
`

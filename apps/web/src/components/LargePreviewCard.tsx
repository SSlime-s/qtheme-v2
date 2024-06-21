import styled from '@emotion/styled'
import { lightTheme } from '@repo/theme/default'
import { useCallback } from 'react'

import { GlassmorphismStyle } from './Glassmorphism'
import { SmallPreview } from './preview'

import type { FormattedTheme } from '@/utils/theme/hooks'
import type { ResolvedTheme } from '@repo/theme/resolve'

type Props = {
  theme: FormattedTheme
  resolvedTheme: ResolvedTheme
} & (
  | {
      changeTheme: (id: string, theme: FormattedTheme) => void
      noId?: false
    }
  | {
      changeTheme: (id: undefined, theme: FormattedTheme) => void
      noId: true
    }
)
export const LargePreviewCard: React.FC<Props> = ({
  theme,
  resolvedTheme,
  changeTheme,
  noId,
}) => {
  const changeHandler = useCallback(() => {
    if (noId === true) {
      changeTheme(undefined, theme)
    } else {
      changeTheme(theme.id, theme)
    }
  }, [changeTheme, noId, theme])

  return (
    <Card>
      <CardInner onClick={changeHandler}>
        <SmallPreview theme={resolvedTheme} author={theme.author} />
        <ChangeCurrentButton>
          <span>change current to this</span>
        </ChangeCurrentButton>
      </CardInner>
    </Card>
  )
}

const Card = styled.div`
  ${GlassmorphismStyle}

  padding: 16px;
  margin: 32px auto;
  max-width: 800px;
  width: 100%;
`
const CardInner = styled.button`
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  display: block;
  width: 100%;

  & > * > span {
    transition: transform 0.2s;
  }
  &:hover > * > span {
    transform: scale(1.05);
  }
`
const ChangeCurrentButton = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  padding: 4px 0;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid ${lightTheme.basic.ui.tertiary};
  backdrop-filter: blur(2px);
  color: ${lightTheme.basic.text.primary};
`

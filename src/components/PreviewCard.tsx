import { resolveTheme } from '@/lib/theme'
import { lightTheme } from '@/lib/theme/default'
import { ThemeWhole, useTheme } from '@/lib/theme/hooks'
import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { useCallback, useMemo } from 'react'
import { FavoriteButton } from './FavoriteButton'
import { GlassmorphismStyle } from './Glassmorphism'
import { SmallPreview } from './preview'
import { BudouJa } from './wrapper/BudouX'
import { ReplaceNewLine } from './wrapper/ReplaceNewLine'

interface Props {
  themeInfo: ThemeWhole
  changeTheme?: (id: string, theme: ThemeWhole) => void
  onFavorite?: (id: string, isFavorite: boolean) => void
}

export const PreviewCard: React.FC<Props> = ({
  themeInfo,
  changeTheme,
  onFavorite,
}) => {
  const resolvedTheme = useMemo(() => {
    return resolveTheme(themeInfo.theme)
  }, [themeInfo])
  const providerTheme = useMemo(() => {
    return { theme: resolvedTheme }
  }, [resolvedTheme])

  const changeToCurrent = useCallback(() => {
    changeTheme?.(themeInfo.id, themeInfo)
  }, [changeTheme, themeInfo])
  const handleFavorite = useCallback(() => {
    onFavorite?.(themeInfo.id, !themeInfo.isLike)
  }, [onFavorite, themeInfo])

  return (
    <ThemeProvider theme={providerTheme}>
      <Wrap>
        <Title>{themeInfo.title}</Title>
        <Author>{themeInfo.author}</Author>
        <Description>
          <BudouJa Wrapper={ReplaceNewLine}>{themeInfo.description}</BudouJa>
        </Description>

        <PreviewWrap onClick={changeToCurrent}>
          <ButtonWrap>click to change & copy</ButtonWrap>
          <SmallPreview theme={resolvedTheme} author={themeInfo.author} />
        </PreviewWrap>

        <ControlWrap>
          <FavoriteButton
            isFavorite={themeInfo.isLike}
            onClick={handleFavorite}
            favoriteCount={themeInfo.likes}
          />
        </ControlWrap>
      </Wrap>
    </ThemeProvider>
  )
}

const Wrap = styled.article`
  ${GlassmorphismStyle}
  width: 100%;
  max-width: 400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  color: #333;
`
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`
const Author = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  text-align: right;
`
const Description = styled.p`
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
`
const PreviewWrap = styled.button`
  ${GlassmorphismStyle}
  width: 100%;
  /* max-width: 300px; */
  align-self: center;
  cursor: pointer;
  margin: 16px 0;

  transition: all 0.1s ease-in;

  &:hover {
    transform: scale(1.05);
  }
`
const ButtonWrap = styled.div`
  text-align: center;
`

const ControlWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`

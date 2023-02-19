import { resolveTheme } from '@/lib/theme'
import { FormattedTheme } from '@/lib/theme/hooks'
import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import { FavoriteButton } from './FavoriteButton'
import { GlassmorphismStyle } from './Glassmorphism'
import { SmallPreview } from './preview'
import { Tag } from './Tag'
import { BreakStyle, BudouJa } from './wrapper/BudouX'
import { ReplaceNewLine } from './wrapper/ReplaceNewLine'

interface Props {
  themeInfo: FormattedTheme
  changeTheme?: (id: string, theme: FormattedTheme) => void
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
        <TagWrap>
          <Tag
            variant={themeInfo.type}
            tag='a'
            href={`/themes/${themeInfo.type}`}
          >
            {themeInfo.type}
          </Tag>
          <Tag
            variant={themeInfo.visibility}
            tag='a'
            href={`/themes/${themeInfo.visibility}`}
          >
            {themeInfo.visibility}
          </Tag>
        </TagWrap>
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

        <DetailButton href={`/theme/${themeInfo.id}`}>
          <span>view detail</span>
        </DetailButton>
      </Wrap>
    </ThemeProvider>
  )
}

const Wrap = styled.article`
  ${GlassmorphismStyle}
  width: 100%;
  max-width: 400px;
  padding: 40px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
  color: #333;
`
const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 8px;
  margin: 8px 0;
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
  ${BreakStyle}

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
`
const PreviewWrap = styled.button`
  ${GlassmorphismStyle}
  width: 100%;
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
  margin-bottom: 16px;
`

const DetailButton = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-top-color: rgba(200, 200, 200, 0.5);
  border-radius: 0 0 20px 20px;
  margin: 0 -41px -1px;
  height: 40px;
  display: grid;
  place-items: center;
  text-transform: capitalize;
  transition: all 0.1s ease-in;

  & > span {
    transition: all 0.1s ease-in;
    transform-origin: center;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:hover > span {
    transform: scale(1.05);
  }
`

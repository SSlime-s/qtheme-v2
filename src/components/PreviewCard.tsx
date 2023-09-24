import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'

import { lineClamp } from '@/styles/lineClamp'
import { resolveTheme } from '@/utils/theme'
import { lightTheme } from '@/utils/theme/default'
import { WrapResolver } from '@/utils/wrapper'
import { BreakStyle, BudouJa } from '@/utils/wrapper/BudouX'
import { Linkify } from '@/utils/wrapper/Linkify'
import { ReplaceNewLine } from '@/utils/wrapper/ReplaceNewLine'

import { FavoriteButton } from './FavoriteButton'
import { GlassmorphismStyle } from './Glassmorphism'
import { Tag } from './Tag'
import { SmallPreview } from './preview'

import type { FormattedTheme } from '@/utils/theme/hooks'

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
    void navigator.clipboard.writeText(JSON.stringify(themeInfo.theme))
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
          <Tag variant={themeInfo.type} tag='div'>
            {themeInfo.type}
          </Tag>
          <Tag variant={themeInfo.visibility} tag='div'>
            {themeInfo.visibility}
          </Tag>
        </TagWrap>
        <Description>
          <WrapResolver Wrapper={[Linkify, BudouJa, ReplaceNewLine]}>
            {themeInfo.description}
          </WrapResolver>
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
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  padding: 32px;
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
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: auto;
  overflow-wrap: anywhere;
`
const Author = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  text-align: right;
  overflow-wrap: anywhere;
`
const Description = styled.p`
  ${BreakStyle}
  ${lineClamp(2)}
`
const PreviewWrap = styled.button`
  ${GlassmorphismStyle}
  border-radius: 8px;
  width: calc(100% + 20px * 2);
  align-self: center;
  cursor: pointer;
  margin: 16px 0;

  transition: all 0.1s ease-out;
  transition-property: transform, background, border-color;

  will-change: transform;

  &:hover {
    transform: scale(1.05);
  }

  &:focus {
    outline: 1px solid ${lightTheme.basic.accent.primary};
    outline-offset: 1px;
  }
`
const ButtonWrap = styled.div`
  text-align: center;
`

const ControlWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  margin-right: -20px;
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
  transition-property: transform, background, border-color;

  & > span {
    transition: all 0.1s ease-in;
    transition-property: transform;
    transform-origin: center;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:hover > span {
    transform: scale(1.05);
  }

  &:focus {
    outline: 1px solid ${lightTheme.basic.accent.primary};
    outline-offset: -2px;
  }
`

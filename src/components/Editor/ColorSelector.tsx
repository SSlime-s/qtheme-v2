import { useControlledAccordion, useHiddenTransition } from '@/utils/accordion'
import { parseHexNotationColor } from '@/model/color'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TransparentCheckerStyle } from '@/components/TransparentChecker'
import { fixLayoutAtom } from '@/pages/_app.page'
import { useSetAtom } from 'jotai'
import { lightTheme } from '@/utils/theme/default'

// NOTE: react color が SSR で動かないので、SSR では動かないようにする
const SketchPicker = dynamic(
  () => import('react-color').then(mod => mod.SketchPicker),
  {
    ssr: false,
  }
)

interface Props {
  allowText?: boolean
  suggestedColors?: string[]
  onChange: (color: string) => void
  value: string

  isExpanded: boolean
  setExpanded?: (expanded: boolean) => void
}
export const ColorSelector: React.FC<Props> = ({
  allowText,
  suggestedColors,
  onChange,
  value,

  isExpanded,
  setExpanded,
}) => {
  const setIsFixed = useSetAtom(fixLayoutAtom)
  const rgbValue = useMemo(() => {
    const ret = parseHexNotationColor(value)
    if (ret === null) {
      return { r: 0, g: 0, b: 0, a: 1 }
    }
    const { type: _, ...rest } = ret
    return rest
  }, [value])

  const [innerColor, setInnerColor] = useState(rgbValue)
  const onChangePartial = useCallback(
    (color: { rgb: { r: number; g: number; b: number; a?: number } }) => {
      setInnerColor({
        ...color.rgb,
        a: color.rgb.a ?? 1,
      })
    },
    [setInnerColor]
  )
  const onChangeComplete = useCallback(
    (color: { hex: string; rgb: { a?: number } }) => {
      if (color.rgb.a === undefined || color.rgb.a === 1) {
        onChange(color.hex)
        return
      }
      const trimmedHex = color.hex.replace(/^#/, '')
      if (trimmedHex.length === 3) {
        const alphaHex = Math.round((color.rgb.a ?? 1) * 15).toString(16)
        onChange(`#${trimmedHex}${alphaHex}`)
        return
      }

      if (trimmedHex.length === 6) {
        const alphaHex = Math.round((color.rgb.a ?? 1) * 255).toString(16)
        onChange(`#${trimmedHex}${alphaHex}`)
        return
      }
    },
    [onChange]
  )

  useEffect(() => {
    setInnerColor(rgbValue)
  }, [rgbValue])

  const { toggle, contentRef, contentHeight, ariaToggle, ariaContent } =
    useControlledAccordion<HTMLDivElement>(isExpanded, setExpanded, 2)

  const onTouchStart = useCallback(() => {
    setIsFixed(true)
  }, [setIsFixed])
  const onTouchEnd = useCallback(() => {
    setIsFixed(false)
  }, [setIsFixed])
  useEffect(() => {
    if (!isExpanded) {
      return
    }
    const content = contentRef.current
    if (content === null) {
      return
    }
    const abortController = new AbortController()
    const { signal } = abortController
    content.addEventListener('touchstart', onTouchStart, {
      signal,
    })
    content.addEventListener('touchend', onTouchEnd, {
      signal,
    })
    content.addEventListener('touchcancel', onTouchEnd, {
      signal,
    })
    return () => {
      abortController.abort()
    }
  }, [isExpanded, onTouchStart, onTouchEnd, contentRef])

  const { ref: wrapRef, style: hiddenStyle } = useHiddenTransition(isExpanded)

  return (
    <Wrap className='mono'>
      <ColorPreview onClick={toggle} {...ariaToggle}>
        <ColorPreviewColor color={value} />
        <ColorPreviewText>{value}</ColorPreviewText>
      </ColorPreview>
      <ContentWrap
        ref={wrapRef}
        height={contentHeight}
        {...ariaContent}
        css={hiddenStyle}
      >
        <div ref={contentRef}>
          <SketchPicker
            color={innerColor}
            onChange={onChangePartial}
            onChangeComplete={onChangeComplete}
            presetColors={suggestedColors}
            disableAlpha={false}
            width='min(100%, 300px)'
            css={css`
              box-sizing: border-box !important;
              margin: 1px;
            `}
          />
        </div>
      </ContentWrap>
    </Wrap>
  )
}

const Wrap = styled.div``

const ColorPreview = styled.button`
  display: grid;
  border-radius: 4px;
  border: 1px solid #ced6db;
  overflow: hidden;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content;
  backdrop-filter: blur(8px);
  width: 100%;
  gap: 8px;
  cursor: pointer;

  transition: all 0.2s ease-out;
  &:hover {
    border-color: #a8b0b5;
  }
  &:focus {
    border-color: ${lightTheme.basic.accent.focus};
  }
`
const ColorPreviewColor = styled.div<{
  color: string
}>`
  aspect-ratio: 1 / 1;
  height: calc(1.5rem + 8px);

  position: relative;
  &:before {
    ${TransparentCheckerStyle}

    content: '';
    position: absolute;
    inset: 0;
  }
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ color }) => color};
  }
`
const ColorPreviewText = styled.div`
  line-height: 1.5;
  padding: 4px;
`

const ContentWrap = styled.div<{ height: number | undefined }>`
  overflow: hidden;
  height: ${({ height }) => (height !== undefined ? `${height}px` : 'auto')};
  transition: height 0.3s ease-out;

  &[aria-hidden='true'] {
    height: 0;
  }
`

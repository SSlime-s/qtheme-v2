import { useControlledAccordion } from '@/lib/accordion'
import { parseHexNotationColor } from '@/model/color'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SketchPicker } from 'react-color'

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
      console.log(color)
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

  return (
    <Wrap>
      <ColorPreview onClick={toggle} {...ariaToggle}>
        <ColorPreviewColor color={value} />
        <ColorPreviewText>{value}</ColorPreviewText>
      </ColorPreview>
      <ContentWrap height={contentHeight} {...ariaContent}>
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
`
const ColorPreviewColor = styled.div<{
  color: string
}>`
  background: ${({ color }) => color};
  aspect-ratio: 1 / 1;
  height: calc(1.5rem + 8px);
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

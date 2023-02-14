import { useControlledAccordion, useHiddenTransition } from '@/lib/accordion'
import { Form } from '@/pages/edit'
import styled from '@emotion/styled'
import { useCallback, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { ColorSelector } from './ColorSelector'

const AdvancedKeys = {
  browser: [
    'themeColor',
    // 'colorScheme',
    'selectionText',
    'selectionBackground',
    'caret',
    'scrollbarThumb',
    'scrollbarTrack',
  ] as const,
  specific: [
    'waveformColor',
    'waveformGradation',

    'navigationBarDesktopBackground',
    'navigationBarMobileBackground',
    'mainViewBackground',
    'sideBarBackground',

    'stampEdgeEnable',
  ] as const,
} as const
const AdvancedKeysKeys = [
  'browser',
  'specific',
] as const satisfies ReadonlyArray<keyof typeof AdvancedKeys>
const DescriptionMap = {
  browser: {
    themeColor: 'スマホブラウザでのアドレスバーでの色',
    selectionText: 'テキスト選択時の文字色',
    selectionBackground: 'テキスト選択時の背景色',
    caret: 'テキストカーソルの色',
    scrollbarThumb: 'スクロールバーのスクロール部分の色',
    scrollbarTrack: 'スクロールバーの背景色',
  },
  specific: {
    waveformColor: '波形の色',
    waveformGradation: '波形のグラデーション',

    navigationBarDesktopBackground: 'デスクトップ版のナビゲーションバーの背景',
    navigationBarMobileBackground: 'モバイル版のナビゲーションバーの背景',
    mainViewBackground: 'メインビューの背景',
    sideBarBackground: 'サイドバーの背景',

    stampEdgeEnable: 'スタンプの枠線を有効化するか',
  },
} as const satisfies {
  [K in keyof typeof AdvancedKeys]: Record<
    typeof AdvancedKeys[K][number],
    string
  >
}
export const AdvancedSelectors: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<Form>()
  const theme = useWatch({ control, name: 'theme' })

  return (
    <div>
      <SelectorGroup>
        <SelectorGroupLabel>Browser</SelectorGroupLabel>
        {AdvancedKeys.browser.map(key => (
          <Selector key={key}>
            <OptionalSelectors key1='browser' label={key} />
          </Selector>
        ))}

        <SelectorGroupLabel>Specific</SelectorGroupLabel>
        {AdvancedKeys.specific.map(key => (
          <Selector key={key}>
            <SelectorLabel>{key}</SelectorLabel>
          </Selector>
        ))}
      </SelectorGroup>
    </div>
  )
}
const SelectorGroup = styled.div`
  margin-bottom: 16px;
`
const SelectorGroupLabel = styled.div`
  font-weight: bold;
  color: #111;
  margin-bottom: 8px;
  letter-spacing: 0.0625em;
`
const Selector = styled.div`
  margin-bottom: 8px;
  padding-left: 8px;
`
const SelectorLabel = styled.div`
  color: #333;
  margin-bottom: 4px;
`

interface OptionalSelectorsProps<K extends keyof typeof AdvancedKeys> {
  key1: K
  label: typeof AdvancedKeys[K][number]
}
const OptionalSelectors: React.FC<
  OptionalSelectorsProps<keyof typeof AdvancedKeys>
> = <K extends keyof typeof AdvancedKeys>({
  key1,
  label,
}: OptionalSelectorsProps<K>) => {
  const [valid, setValid] = useState(false)
  const { ariaContent, ariaToggle, contentHeight, contentRef } =
    useControlledAccordion(valid, setValid)
  const [isExpanded, setIsExpanded] = useState(false)
  const toggle = useCallback(() => {
    setValid(valid => {
      if (valid) {
        setIsExpanded(false)
      }
      return !valid
    })
  }, [])
  const { ref: wrapRef, style: hiddenStyle } = useHiddenTransition(valid)

  const { control, setValue, getValues } = useFormContext<Form>()
  const [innerColor, setInnerColor] = useState(
    getValues('theme')?.[key1]?.[
      label as keyof typeof DescriptionMap[keyof typeof DescriptionMap]
    ] ?? '#000000'
  )
  useEffect(() => {
    if (valid) {
      setValue('theme', {
        ...getValues('theme'),
        [key1]: {
          ...getValues('theme')?.[key1],
          [label]: innerColor,
        },
      })
      return
    }
    const newVal = { ...getValues('theme')?.[key1] }
    if (newVal === undefined) {
      return
    }
    // @ts-expect-error: label と key の対応がうまくいかない
    delete newVal[label]
    if (Object.keys(newVal).length === 0) {
      setValue('theme', {
        ...getValues('theme'),
        [key1]: undefined,
      })
      return
    }
    setValue('theme', {
      ...getValues('theme'),
      [key1]: newVal,
    })
  }, [getValues, innerColor, key1, label, setValue, valid])

  useEffect(() => {
    setInnerColor(
      getValues('theme')?.[key1]?.[
        label as keyof typeof DescriptionMap[keyof typeof DescriptionMap]
      ] ?? '#000000'
    )
  }, [getValues, key1, label])

  return (
    <OptionalSelectorWrap valid={valid}>
      <OptionalSelectorsLabel {...ariaToggle} onClick={toggle}>
        <OptionalSelectorsIcon />
        {label}
        <OptionalSelectorsDisableText>無効化中</OptionalSelectorsDisableText>
      </OptionalSelectorsLabel>
      <OptionalSelectorsContent
        ref={wrapRef}
        {...ariaContent}
        height={contentHeight ?? 0}
        css={hiddenStyle}
      >
        <div ref={contentRef}>
          <Description>
            {
              DescriptionMap[key1][
                label as keyof typeof DescriptionMap[keyof typeof DescriptionMap]
              ]
            }
          </Description>
          <ColorSelector
            isExpanded={isExpanded}
            setExpanded={setIsExpanded}
            value={innerColor}
            onChange={setInnerColor}
          />
        </div>
      </OptionalSelectorsContent>
    </OptionalSelectorWrap>
  )
}
const OptionalSelectorWrap = styled.div<{ valid: boolean }>`
  transition: all 0.2s ease-out;
  transform: ${({ valid }) => (valid ? 'none' : 'translateX(16px)')};
`
const OptionalSelectorsLabel = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  width: 100%;

  transition: all 0.2s ease-out;
  transform-origin: left center;
  &:hover {
    transform: scale(1.05, 1.1);
  }
`
const Description = styled.p`
  color: #333;
`
const OptionalSelectorsIcon = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  /* transition: all 0.2s ease-out;

  *:hover > & {
    transform: scale(1.1);
  } */

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 1px;
    background-color: #333;
    transform-origin: center;
    transition: all 0.2s ease-out, transform 0.2s ease-out;
  }
  &::before {
    width: 16px;
    height: 2px;
    top: 7px;
    left: 0;
  }
  &::after {
    width: 2px;
    height: 16px;
    top: 0;
    left: 7px;
  }

  [aria-expanded='true'] > &::before {
    transform: rotate(225deg) scale(1.4, 1);
  }
  [aria-expanded='true'] > &::after {
    transform: rotate(225deg) scale(1, 1.4);
  }
`
const OptionalSelectorsDisableText = styled.span`
  color: #333;
  font-size: 12px;
  transition: color 0.2s ease-out;

  [aria-expanded='true'] > & {
    color: transparent;
  }
`
const OptionalSelectorsContent = styled.div<{ height: number }>`
  overflow: hidden;
  transition: height 0.2s ease-out;
  height: ${({ height }) => height}px;
  padding-left: 24px;

  &[aria-hidden='true'] {
    height: 0;
  }
`

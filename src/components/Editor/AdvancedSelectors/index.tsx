import { Form } from '@/components/Editor'
import styled from '@emotion/styled'
import { useFormContext, useWatch } from 'react-hook-form'
import { OptionalSelectors } from './OptionalSelectors'

export const AdvancedKeys = {
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

    // TODO: boolean の実装が面倒なので後回し
    // 'stampEdgeEnable',
  ] as const,
} as const
export const AdvancedKeysKeys = [
  'browser',
  'specific',
] as const satisfies ReadonlyArray<keyof typeof AdvancedKeys>
export const DescriptionMap = {
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

    // stampEdgeEnable: 'スタンプの枠線を有効化するか',
  },
} as const satisfies {
  [K in keyof typeof AdvancedKeys]: Record<
    (typeof AdvancedKeys)[K][number],
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
            <OptionalSelectors
              key1='specific'
              label={key}
              // type={key === 'stampEdgeEnable' ? 'boolean' : 'text'}
              type='text'
            />
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

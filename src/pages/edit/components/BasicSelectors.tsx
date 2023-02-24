import { resolveTheme } from "@/lib/theme"
import { Theme } from "@/model/theme"
import styled from "@emotion/styled"
import { useCallback, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { ColorSelector } from "./ColorSelector"
import { Form } from "../index.page"

const BasicKeys = {
  accent: ['primary', 'notification', 'online', 'error', 'focus'] as const,
  background: ['primary', 'secondary', 'tertiary'] as const,
  ui: ['primary', 'secondary', 'tertiary'] as const,
  text: ['primary', 'secondary'] as const,
} as const
const BasicKeysKeys = [
  'accent',
  'background',
  'ui',
  'text',
] as const satisfies ReadonlyArray<keyof typeof BasicKeys>
export const BasicSelectors: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<Form>()
  const theme = useWatch({ control, name: 'theme' })
  const basicTheme = useMemo(() => {
    return theme.basic
  }, [theme])
  const resolvedTheme = useMemo(() => {
    return resolveTheme(theme)
  }, [theme])

  const setBasicTheme = useCallback(
    (newTheme: Partial<Theme['basic']>) => {
      const prev = getValues('theme')
      setValue(
        'theme',
        { ...prev, basic: { ...prev.basic, ...newTheme } },
        {
          shouldDirty: true,
        }
      )
    },
    [getValues, setValue]
  )

  const [expanded, setExpanded] = useState<string>()

  return (
    <div>
      {BasicKeysKeys.map(key1 => (
        <SelectorGroup key={key1}>
          <SelectorGroupLabel>{key1}</SelectorGroupLabel>
          {BasicKeys[key1].map(key2 => (
            <Selector key={key2}>
              <SelectorLabel>{key2}</SelectorLabel>
              <ColorSelector
                // @ts-expect-error: TODO: key の chain をうまく認識できてない
                value={resolvedTheme.basic[key1][key2].default}
                onChange={color => {
                  setBasicTheme({
                    [key1]: {
                      ...basicTheme[key1],
                      [key2]: color,
                    },
                  })
                }}
                isExpanded={expanded === `${key1}.${key2}`}
                setExpanded={v =>
                  setExpanded(v ? `${key1}.${key2}` : undefined)
                }
              />
            </Selector>
          ))}
        </SelectorGroup>
      ))}
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

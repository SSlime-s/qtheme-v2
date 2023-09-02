import { ThemeProvider } from '@emotion/react'

import { TextBox } from './TextBox'

import type { ComponentMeta } from '@storybook/react'

import { resolveTheme } from '@/utils/theme'
import { lightTheme } from '@/utils/theme/default'

export default {
  title: 'Components/TextBox',
  component: TextBox,
} as ComponentMeta<typeof TextBox>

export const Default = () => (
  <ThemeProvider theme={{ theme: resolveTheme(lightTheme) }}>
    <TextBox placeholder='placeholder' />
  </ThemeProvider>
)

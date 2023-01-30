import { resolveTheme } from '@/lib/theme'
import { lightTheme } from '@/lib/theme/default'
import { ThemeProvider } from '@emotion/react'
import { ComponentMeta } from '@storybook/react'
import { TextBox } from './TextBox'

export default {
  title: 'Components/TextBox',
  component: TextBox,
} as ComponentMeta<typeof TextBox>

export const Default = () => (
  <ThemeProvider theme={{ theme: resolveTheme(lightTheme) }}>
    <TextBox placeholder='placeholder' />
  </ThemeProvider>
)

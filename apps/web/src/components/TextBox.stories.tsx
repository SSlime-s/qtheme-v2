import { ThemeProvider } from '@emotion/react'
import { lightTheme } from '@repo/theme/default'
import { resolveTheme } from '@repo/theme/resolve'

import { TextBox } from './TextBox'

import type { Meta } from '@storybook/react'

const meta: Meta<typeof TextBox> = {
  title: 'Components/TextBox',
  component: TextBox,
}

export default meta

export const Default = () => (
  <ThemeProvider theme={{ theme: resolveTheme(lightTheme) }}>
    <TextBox placeholder='placeholder' />
  </ThemeProvider>
)

import { ThemeProvider } from '@emotion/react'

import { resolveTheme } from '@/utils/theme'
import { lightTheme } from '@/utils/theme/default'

import { Message } from './Message'

import type { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Message',
  component: Message,
} as ComponentMeta<typeof Message>

const Template: ComponentStory<typeof Message> = args => (
  <ThemeProvider theme={{ theme: resolveTheme(lightTheme) }}>
    <Message {...args} />
  </ThemeProvider>
)

export const Default = Template.bind({})
Default.args = {
  iconUser: 'SSlime',
  name: 'SSlime',
  tag: '20B',
  date: '8/28',
  content:
    '東京工業大学デジタル創作同好会 traP のデフォルトテーマのライトテーマです。\n長いテキスト\n長いテキスト\n長いテキスト->改行しない\\n<-\n長いテキスト',
  stamps: null,
}

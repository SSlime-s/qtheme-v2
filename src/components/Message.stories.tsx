import { resolveTheme } from '@/lib/theme'
import { lightTheme } from '@/lib/theme/default'
import { ThemeProvider } from '@emotion/react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Message } from './Message'

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
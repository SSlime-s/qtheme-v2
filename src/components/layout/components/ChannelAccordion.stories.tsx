import { resolveTheme } from '@/lib/theme'
import { lightTheme, darkTheme } from '@/lib/theme/default'
import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChannelAccordion } from './ChannelAccordion'

export default {
  title: 'Components/Layout/Components/ChannelAccordion',
  component: ChannelAccordion,
} as ComponentMeta<typeof ChannelAccordion>

const Template: ComponentStory<typeof ChannelAccordion> = args => {
  return (
    <ThemeProvider theme={{ theme: args.theme }}>
      <Wrap>
        <ChannelAccordion {...args}>aaaa</ChannelAccordion>
      </Wrap>
    </ThemeProvider>
  )
}
const Wrap = styled.div`
  width: 280px;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.theme.basic.background.secondary.default};
`

export const LightDefault: ComponentStory<typeof ChannelAccordion> =
  Template.bind({})
LightDefault.args = {
  name: 'favorite',
  theme: resolveTheme(lightTheme),
  to: '#',
}

export const DarkDefault: ComponentStory<typeof ChannelAccordion> =
  Template.bind({})
DarkDefault.args = {
  name: 'favorite',
  theme: resolveTheme(darkTheme),
  to: '#',
}

import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { lightTheme, darkTheme } from '@repo/theme/default'
import { resolveTheme } from '@repo/theme/resolve'

import { Channel, ChannelAccordion } from './ChannelAccordion'

import type { ResolvedTheme } from '@repo/theme/resolve'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Layout/Components/ChannelAccordion',
  component: ChannelAccordion,
} as ComponentMeta<typeof ChannelAccordion>

const Template: ComponentStory<typeof ChannelAccordion> = function (
  this: {
    theme: ResolvedTheme
  },
  args
) {
  return (
    <ThemeProvider theme={{ theme: this.theme }}>
      <Wrap>
        <ChannelAccordion {...args}>
          <Channel name='light' to='#' />
          <Channel name='dark' to='#' />
        </ChannelAccordion>
        <ChannelAccordion {...args}>
          <Channel name='light' to='#' />
          <Channel name='dark' to='#' />
        </ChannelAccordion>
      </Wrap>
    </ThemeProvider>
  )
}
const Wrap = styled.div`
  width: 280px;
  height: 100%;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
`

export const LightDefault: ComponentStory<typeof ChannelAccordion> =
  Template.bind({
    theme: resolveTheme(lightTheme),
  })
LightDefault.args = {
  name: 'favorite',
  to: '#',
}

export const DarkDefault: ComponentStory<typeof ChannelAccordion> =
  Template.bind({
    theme: resolveTheme(darkTheme),
  })
DarkDefault.args = {
  name: 'favorite',
  to: '#',
}

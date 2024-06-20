import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'

import { resolveTheme } from '@/utils/theme'
import { lightTheme, darkTheme } from '@/utils/theme/default'

import { GlassmorphismStyle } from './Glassmorphism'
import { SmallPreview } from './preview'

import type { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Preview',
  component: SmallPreview,
} as ComponentMeta<typeof SmallPreview>

const Template: ComponentStory<typeof SmallPreview> = (
  args: Parameters<typeof SmallPreview>[0]
) => (
  <ThemeProvider theme={{ theme: args.theme }}>
    <Wrap>
      <WrapCard>
        <CardGlass>
          <SmallPreview {...args} />
        </CardGlass>
      </WrapCard>
    </Wrap>
  </ThemeProvider>
)
const Wrap = styled.div`
  height: 100%;
  width: 400px;
  background-color: white;
  border: 2px solid black;
`
const WrapCard = styled.div`
  margin: 40px;
  border-radius: 20px;
  overflow: hidden;

  background: radial-gradient(
      ellipse at left top,
      ${({ theme }) => theme.theme.basic.background.primary.default} 0%,
      transparent 100%
    ),
    radial-gradient(
      ellipse at right bottom,
      ${({ theme }) => theme.theme.basic.accent.primary.default} 0%,
      transparent 100%
    );
`
const CardGlass = styled.div`
  ${GlassmorphismStyle}
  padding: 40px;
`

export const LightDefault: ComponentStory<typeof SmallPreview> = Template.bind(
  {}
)
LightDefault.args = {
  author: 'SSlime',
  theme: resolveTheme(lightTheme),
}

export const DarkDefault: ComponentStory<typeof SmallPreview> = Template.bind(
  {}
)
DarkDefault.args = {
  author: 'SSlime',
  theme: resolveTheme(darkTheme),
}

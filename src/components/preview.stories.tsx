import { resolveTheme } from '@/lib/theme'
import { lightTheme, darkTheme } from '@/lib/theme/default'
import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { GlassmorphismCard } from './card'
import { SmallPreview } from './preview'

export default {
  title: 'Components/Preview',
  component: SmallPreview,
} as ComponentMeta<typeof SmallPreview>

const Template: ComponentStory<typeof SmallPreview> = (
  args: Parameters<typeof SmallPreview>[0]
) => (
  <Wrap>
    <WrapCard>
      <CardBackground {...args} />
      <CardGlass />
      <SmallPreview {...args} />
    </WrapCard>
  </Wrap>
)
const Wrap = styled.div`
  height: 100%;
  width: 400px;
  background-color: white;
  border: 2px solid black;
`
const WrapCard = styled.div`
  padding: 40px;
  margin: 40px;
  position: relative;
  background-color: transparent;
  border-radius: 20px;
  overflow: hidden;
`
const CardBackground = styled.div<Parameters<typeof SmallPreview>[0]>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: radial-gradient(
      ellipse at left top,
      ${({ theme }) => theme.basic.background.primary.default} 0%,
      transparent 100%
    ),
    radial-gradient(
      ellipse at right bottom,
      ${({ theme }) => theme.basic.accent.primary.default} 0%,
      transparent 100%
    );
`
const CardGlass = styled(GlassmorphismCard)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

import { ResolvedTheme, resolveTheme } from '@/utils/theme'
import { lightTheme, darkTheme } from '@/utils/theme/default'
import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Layout } from '.'

export default {
  title: 'Components/Layout',
  component: Layout,
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = function (
  this: {
    theme: ResolvedTheme
  },
  args: Parameters<typeof Layout>[0]
) {
  return (
    <ThemeProvider theme={{ theme: this.theme }}>
      <Wrap>
        <Layout {...args}>
          <Content>
            <div>top</div>
            <div>bottom</div>
          </Content>
        </Layout>
      </Wrap>
    </ThemeProvider>
  )
}
const Wrap = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1000px;
`

export const LightLogin: ComponentStory<typeof Layout> = Template.bind({
  theme: resolveTheme(lightTheme),
})
LightLogin.args = {
  userId: 'SSlime',
}

export const DarkLogin: ComponentStory<typeof Layout> = Template.bind({
  theme: resolveTheme(darkTheme),
})
DarkLogin.args = {
  userId: 'SSlime',
}

export const LightNotLogin: ComponentStory<typeof Layout> = Template.bind({
  theme: resolveTheme(lightTheme),
})
LightNotLogin.args = {
  userId: undefined,
}

export const DarkNotLogin: ComponentStory<typeof Layout> = Template.bind({
  theme: resolveTheme(darkTheme),
})
DarkNotLogin.args = {
  userId: undefined,
}

import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";

import { darkTheme, lightTheme } from "@repo/theme/default";
import { resolveTheme } from "@repo/theme/resolve";

import { Layout } from ".";

import type { ResolvedTheme } from "@repo/theme/resolve";
import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof Layout> = {
  title: "Components/Layout",
  component: Layout,
};

export default meta;

const Template: StoryFn<typeof Layout> = function (
  this: {
    theme: ResolvedTheme;
  },
  args: Parameters<typeof Layout>[0],
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
  );
};
const Wrap = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1000px;
`;

export const LightLogin: StoryFn<typeof Layout> = Template.bind({
  theme: resolveTheme(lightTheme),
});
LightLogin.args = {
  userId: "SSlime",
};

export const DarkLogin: StoryFn<typeof Layout> = Template.bind({
  theme: resolveTheme(darkTheme),
});
DarkLogin.args = {
  userId: "SSlime",
};

export const LightNotLogin: StoryFn<typeof Layout> = Template.bind({
  theme: resolveTheme(lightTheme),
});
LightNotLogin.args = {
  userId: undefined,
};

export const DarkNotLogin: StoryFn<typeof Layout> = Template.bind({
  theme: resolveTheme(darkTheme),
});
DarkNotLogin.args = {
  userId: undefined,
};

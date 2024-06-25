import { Tag } from "./Tag";

import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  argTypes: {
    variant: {
      control: {
        type: "inline-radio",
        options: ["light", "dark", "other", "public", "private", "draft"],
      },
    },
  },
};

export default meta;

const Template: StoryFn<typeof Tag> = (args) => (
  <Tag {...args}>{args.variant}</Tag>
);

export const Default: StoryFn<typeof Tag> = Template.bind({});
Default.args = {
  tag: "button",
  variant: "light",
};

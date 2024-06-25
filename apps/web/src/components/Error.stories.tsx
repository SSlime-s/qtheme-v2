import { Error } from "./Error";

import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof Error> = {
  title: "Components/Error",
  component: Error,
  argTypes: {
    statusCode: {
      control: "number",
      defaultValue: 404,
      options: [404, 403, 401, 500],
    },
  },
};

export default meta;

const Template: StoryFn<typeof Error> = (args: Parameters<typeof Error>[0]) => (
  <Error {...args} />
);

export const Default: StoryFn<typeof Error> = Template.bind({});
Default.args = {
  statusCode: 404,
};

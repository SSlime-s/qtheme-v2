import { Error } from './Error'

import type { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Error',
  component: Error,
  argTypes: {
    statusCode: {
      control: 'number',
      defaultValue: 404,
      options: [404, 403, 401, 500],
    },
  },
} as ComponentMeta<typeof Error>

const Template: ComponentStory<typeof Error> = (
  args: Parameters<typeof Error>[0]
) => <Error {...args} />

export const Default: ComponentStory<typeof Error> = Template.bind({})
Default.args = {
  statusCode: 404,
}

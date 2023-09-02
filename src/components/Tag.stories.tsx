import { Tag } from './Tag'

import type { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    variant: {
      control: {
        type: 'inline-radio',
        options: ['light', 'dark', 'other', 'public', 'private', 'draft'],
      },
    },
  },
} as ComponentMeta<typeof Tag>

const Template: ComponentStory<typeof Tag> = args => (
  <Tag {...args}>{args.variant}</Tag>
)

export const Default = Template.bind({})
Default.args = {
  tag: 'button',
  variant: 'light',
}

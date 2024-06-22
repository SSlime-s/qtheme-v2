import { fn } from '@storybook/test'

import { FavoriteButton } from './FavoriteButton'

import type { Meta, StoryFn } from '@storybook/react'

const meta: Meta<typeof FavoriteButton> = {
  title: 'Components/FavoriteButton',
  component: FavoriteButton,
  args: {
    onClick: fn()
  },
  argTypes: {
    isFavorite: { control: 'boolean' },
    favoriteCount: { control: 'number' },
  },
}
export default meta

const Template: StoryFn<typeof FavoriteButton> = (
  args: Parameters<typeof FavoriteButton>[0]
) => <FavoriteButton {...args} />

export const Default: StoryFn<typeof FavoriteButton> = Template.bind({})
Default.args = {
  isFavorite: false,
  favoriteCount: 100,
}

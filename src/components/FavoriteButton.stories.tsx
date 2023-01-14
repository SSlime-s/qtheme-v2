import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FavoriteButton } from './FavoriteButton'

export default {
  title: 'Components/FavoriteButton',
  component: FavoriteButton,
  argTypes: {
    isFavorite: { control: 'boolean' },
    onClick: { action: 'onClick' },
    favoriteCount: { control: 'number' },
  },
} as ComponentMeta<typeof FavoriteButton>

const Template: ComponentStory<typeof FavoriteButton> = (
  args: Parameters<typeof FavoriteButton>[0]
) => <FavoriteButton {...args} />

export const Default: ComponentStory<typeof FavoriteButton> = Template.bind({})
Default.args = {
  isFavorite: false,
  favoriteCount: 100,
}

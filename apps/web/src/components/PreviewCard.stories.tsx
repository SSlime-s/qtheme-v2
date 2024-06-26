import styled from "@emotion/styled";
import { fn } from "@storybook/test";

import { darkTheme, lightTheme } from "@repo/theme/default";

import { PreviewCard } from "./PreviewCard";

import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof PreviewCard> = {
	title: "Components/PreviewCard",
	component: PreviewCard,
	args: {
		changeTheme: fn(),
	},
};

export default meta;

const Template: StoryFn<typeof PreviewCard> = (
	args: Parameters<typeof PreviewCard>[0],
) => (
	<Wrap>
		<PreviewCard {...args} />
	</Wrap>
);

const Wrap = styled.div`
  min-height: 100%;
  width: 100%;
  background: linear-gradient(116.36deg, #156cee 0%, #f04545 100%);
  padding: 32px;
`;

export const LightDefault: StoryFn<typeof PreviewCard> = Template.bind({});
LightDefault.args = {
	themeInfo: {
		id: "light",
		author: "SSlime",
		title: "Default Light",
		description:
			"東京工業大学デジタル創作同好会 traP のデフォルトテーマのライトテーマです。\n長いテキスト\n長いテキスト\n長いテキスト->改行しない\\n<-\n長いテキスト",
		type: "light",
		visibility: "public",
		createdAt: "2021-05-01T00:00:00.000Z",
		likes: 100,
		isLike: false,
		theme: lightTheme,
	},
};

export const DarkDefault: StoryFn<typeof PreviewCard> = Template.bind({});
DarkDefault.args = {
	themeInfo: {
		id: "dark",
		author: "SSlime",
		title: "Default Dark",
		description:
			"東京工業大学デジタル創作同好会 traP のデフォルトテーマのダークテーマです。\n長いテキスト\n長いテキスト\n長いテキスト\n長いテキスト",
		type: "dark",
		visibility: "public",
		createdAt: "2021-05-01T00:00:00.000Z",
		likes: 100,
		isLike: true,
		theme: darkTheme,
	},
};

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

import { userIconUrl } from "@/utils/api";

interface Props {
	iconUser: string;
	name?: string;
	tag: string;
	date: string;
	content: React.ReactNode;
	stamps?: React.ReactNode;

	nonHover?: boolean;
	className?: string;
}

export const Message = ({
	iconUser,
	name: nameRaw,
	tag,
	date,
	content,
	stamps,
	nonHover = false,
	className,
}: Props) => {
	const name = nameRaw ?? iconUser;

	return (
		<Wrap className={className} nonHover={nonHover}>
			<Icon href={`/user/${name}`}>
				<Image src={userIconUrl(iconUser)} alt={name} width={40} height={40} unoptimized />
			</Icon>
			<Header>
				<NameWrap>{name}</NameWrap>
				<TagWrap>{tag}</TagWrap>
				<DateWrap>{date}</DateWrap>
			</Header>
			<Content>{content}</Content>
			{stamps !== undefined ? <Stamps>{stamps}</Stamps> : null}
		</Wrap>
	);
};

export const H1 = styled.p`
  font-size: 2rem;
  font-weight: bold;
  overflow-wrap: anywhere;
`;
export const H2 = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  overflow-wrap: anywhere;
`;
export const H3 = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  overflow-wrap: anywhere;
`;
export const H4 = styled.p`
  font-size: 1rem;
  font-weight: bold;
  overflow-wrap: anywhere;
`;
export const H5 = styled.p`
  font-size: 0.875rem;
  font-weight: bold;
  overflow-wrap: anywhere;
`;
export const H6 = styled.p`
  font-size: 0.85rem;
  font-weight: bold;
  overflow-wrap: anywhere;
  ${({ theme }) => theme.theme.markdown.h6Text};
`;

const Wrap = styled.div<{ nonHover: boolean }>`
  display: grid;
  grid-template-areas: 'icon header' 'icon content' '... content' '... stamps';
  grid-template-columns: 40px 1fr;
  grid-template-rows: 20px auto 1fr fit-content;
  content: contain;
  padding: 8px 32px;
  overflow: clip;
  width: 100%;

  ${({ nonHover, theme }) =>
		!nonHover &&
		css`
      &:hover {
        background: ${theme.theme.specific.messageHoverBackground};
      }
    `}
`;
const Icon = styled(Link)`
  grid-area: icon;
  height: 40px;
  width: 40px;
  border-radius: 9999px;
  overflow: hidden;
`;
const Header = styled.div`
  grid-area: header;
  margin-left: 8px;
  display: flex;
  align-items: baseline;
  gap: 4px;
`;
const NameWrap = styled.span`
  font-weight: bold;
  flex: 2;
  max-width: min-content;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
`;
const TagWrap = styled.span`
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  font-size: 0.875rem;
  display: inline-grid;
  place-items: center;
  font-weight: bold;
  padding: 0 4px;
  border-radius: 4px;
`;
const DateWrap = styled.span`
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  font-size: 0.75rem;
`;
const Content = styled.div`
  grid-area: content;
  margin-top: 4px;
  margin-left: 8px;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
`;
const Stamps = styled.div`
  grid-area: stamps;
  margin-top: 8px;
  margin-left: 8px;
`;

export const FullWidthContent = styled.div`
  margin-left: calc(-40px - 8px);
`;

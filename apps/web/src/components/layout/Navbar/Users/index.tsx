import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

import { Error } from "@/components/Error";
import { Skeleton } from "@/components/LoadingBar";
import { userIconUrl } from "@/utils/api";

import { FilterBox } from "./FilterBox";
import { useAuthors } from "./useAuthors";

export const NavbarUsers: React.FC = () => {
	const {
		data: { raw: rawData, filtered, filterWord },
		error,
		isLoading,
		mutate: { setFilterWord },
	} = useAuthors();
	const placeholder = "ra, ^SSl, ime$, ^traP$, ...";

	if (isLoading) {
		return (
			<Wrap>
				<FilterBox
					word={filterWord}
					setWord={setFilterWord}
					placeholder={placeholder}
				/>
				{Array.from({ length: 8 }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: 固定なので問題ない
					<UserSkeleton key={i} />
				))}
			</Wrap>
		);
	}

	if (error !== undefined) {
		return (
			<Wrap>
				<Error statusCode={500} />
			</Wrap>
		);
	}

	if (rawData === undefined || rawData.length === 0) {
		return <Wrap>ユーザーがいません</Wrap>;
	}

	return (
		<Wrap>
			<FilterBox
				word={filterWord}
				setWord={setFilterWord}
				placeholder={placeholder}
			/>
			{filtered.length === 0 && <Empty>該当するユーザーはいません</Empty>}
			{filtered.map(({ name, count }) => (
				<UserCard key={name} name={name} count={count} />
			))}
		</Wrap>
	);
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Empty = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  padding: 24px 0;
`;

const UserCard: React.FC<{
	name: string;
	count: number;
}> = ({ name, count }) => {
	return (
		<CardWrap href={`/user/${name}`}>
			<Icon src={userIconUrl(name)} alt="" width={36} height={36} unoptimized />
			<Name>{name}</Name>
			<Count>{count}投稿</Count>
		</CardWrap>
	);
};
const UserSkeleton: React.FC = () => {
	return (
		<CardWrapSkelton
			tabIndex={0}
			role="progressbar"
			aria-busy={true}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuetext="Loading..."
		>
			<Skeleton
				width="36px"
				height="36px"
				borderRadius="9999px"
				css={css`
          grid-area: icon;
        `}
			/>
			<Skeleton
				width="100px"
				height="14px"
				borderRadius="9999px"
				css={css`
          grid-area: name;
        `}
			/>
			<Skeleton
				width="40px"
				height="12px"
				borderRadius="9999px"
				css={css`
          grid-area: count;
          align-self: flex-end;
        `}
			/>
		</CardWrapSkelton>
	);
};
const CardBaseStyle = css`
  display: grid;
  grid-template-areas:
    'icon name'
    'icon count';
  grid-template-columns: 36px 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 16px;
  padding: 4px 8px;
  margin: 0 -8px;
  border-radius: 4px;
`;
const CardWrap = styled(Link)`
  ${CardBaseStyle}

  box-shadow: inset 0 0 4px -1px transparent;
  transition: box-shadow 0.2s ease-out;
  &:hover {
    box-shadow: inset 0 0 4px -1px ${({ theme }) => theme.theme.basic.ui.primary.default};
  }

  &:focus {
    outline: 1px solid
      ${({ theme }) => theme.theme.basic.accent.primary.default};
  }
`;
const CardWrapSkelton = styled.div`
  ${CardBaseStyle}

  justify-content: center;
`;
const Icon = styled(Image)`
  grid-area: icon;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  place-self: center;
`;
const Name = styled.div`
  grid-area: name;
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: flex-end;
`;
const Count = styled.div`
  grid-area: count;
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: flex-start;
`;

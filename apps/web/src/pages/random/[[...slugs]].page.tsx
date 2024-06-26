import styled from "@emotion/styled";
import Head from "next/head";
import { useMemo } from "react";
import { TfiReload } from "react-icons/tfi";

import { CopyButton } from "@/components/CopyButton";
import { Error } from "@/components/Error";
import { FavoriteButton } from "@/components/FavoriteButton";
import { GlassmorphismStyle } from "@/components/Glassmorphism";
import { LargePreviewCard } from "@/components/LargePreviewCard";
import { LoadingBar } from "@/components/LoadingBar";
import { H1, H2, Message } from "@/components/Message";
import { SEO } from "@/components/SEO";
import { TextBox } from "@/components/TextBox";
import { Layout } from "@/components/layout";
import { extractShowcaseUser } from "@/utils/extractUser";
import { isMobile } from "@/utils/isMobile";
import { useCurrentTheme } from "@/utils/theme/hooks";
import { pageTitle } from "@/utils/title";
import { assertIsArray } from "@/utils/typeUtils";
import { useWithAuth } from "@/utils/useWithAuth";
import { useSetUserId } from "@/utils/userId";
import { WrapResolver } from "@/utils/wrapper";
import { BreakStyle, BudouJa } from "@/utils/wrapper/BudouX";
import { Linkify } from "@/utils/wrapper/Linkify";
import { ReplaceNewLine } from "@/utils/wrapper/ReplaceNewLine";
import { lightTheme } from "@repo/theme/default";

import { useRandomTheme } from "./hooks";

import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { NextPageWithLayout } from "../_app.page";

export const getServerSideProps = (async ({ req, query }) => {
	const userId = extractShowcaseUser(req);

	const { slugs } = query;
	let filter: "all" | "light" | "dark" | "invalid";
	if (slugs === undefined || slugs.length === 0) {
		filter = "all";
	} else if (slugs.length === 1) {
		assertIsArray(slugs);
		if (["light", "dark"].includes(slugs[0].toLowerCase())) {
			filter = slugs[0].toLowerCase() as "light" | "dark";
		} else {
			filter = "invalid";
		}
	} else {
		filter = "invalid";
	}

	if (filter === "invalid") {
		return {
			redirect: {
				destination: "/random",
				permanent: false,
			},
		};
	}

	return {
		props: {
			userId: userId ?? null,
			filter,
		},
	};
}) satisfies GetServerSideProps;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const RandomPage: NextPageWithLayout<Props> = ({ userId, filter }) => {
	useSetUserId(userId);

	const {
		theme,
		resolvedTheme,
		isLoading,
		error,
		mutate: { changeNext, toggleLike },
	} = useRandomTheme(filter === "all" ? null : filter);
	const {
		mutate: { changeTheme },
	} = useCurrentTheme();

	const toggleLikeWithAuth = useWithAuth(
		userId,
		toggleLike,
		"favorite は部員限定です",
	);

	const themeString = useMemo(() => {
		if (theme === null) {
			return "";
		}
		return JSON.stringify(theme.theme);
	}, [theme]);

	if (error !== undefined) {
		return <Error statusCode={500} />;
	}
	if (isLoading || theme === null || resolvedTheme === null) {
		return <LoadingBar />;
	}

	return (
		<>
			<Head>
				<title>
					{pageTitle(`#random${filter !== "all" ? `/${filter}` : ""}`)}
				</title>
			</Head>
			<SEO
				title={`#random${filter !== "all" ? `/${filter}` : ""}`}
				url={`/random${filter !== "all" ? `/${filter}` : ""}`}
			/>
			<Wrap>
				<MainWrap>
					<ChangeNextButton onClick={changeNext}>
						次のテーマを表示 <TfiReload />
					</ChangeNextButton>
					<Message
						iconUser={theme.author}
						content={
							<>
								<H1>{theme.title}</H1>
								<LargePreviewCard
									theme={theme}
									resolvedTheme={resolvedTheme}
									changeTheme={changeTheme}
								/>
							</>
						}
						date={theme.createdAt}
						tag={theme.type}
						name={theme.author}
						stamps={
							<FavoriteButton
								isFavorite={theme.isLike}
								onClick={toggleLikeWithAuth}
								favoriteCount={theme.likes}
							/>
						}
					/>
					<Message
						iconUser={theme.author}
						content={
							<>
								<H2>詳細</H2>
								<BreakP>
									<WrapResolver Wrapper={[Linkify, BudouJa, ReplaceNewLine]}>
										{theme.description}
									</WrapResolver>
								</BreakP>
							</>
						}
						date={theme.createdAt}
						tag={theme.type}
						name={theme.author}
					/>
				</MainWrap>
				<CopyBox
					defaultValue={themeString}
					after={<After text={themeString} changeNext={changeNext} />}
					aria-label="テーマのjson"
					readOnly
				/>
			</Wrap>
		</>
	);
};
export default RandomPage;
RandomPage.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

const Wrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 1fr max-content;
`;
const MainWrap = styled.div`
  contain: strict;
  overflow-y: auto;
`;

const ChangeNextButton = styled.button`
  ${GlassmorphismStyle}

  width: calc(100% - 48px);
  margin: 16px 24px;
  padding: 16px 24px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
  &:focus {
    outline: 1px solid ${lightTheme.basic.accent.primary};
    outline-offset: -2px;
  }
`;
export const BreakP = styled.p`
  ${BreakStyle}

  & > a {
    color: ${({ theme }) => theme.theme.markdown.linkText};

    &:hover {
      text-decoration: underline;
    }
  }
`;
const CopyBox = styled(TextBox)`
  margin: 0 32px 20px;
  & textarea {
    white-space: nowrap;
  }
  ${isMobile} {
    border-radius: 0;
    margin: 0;
  }
`;

interface AfterProps {
	text: string;
	changeNext?: () => void;
}
const After: React.FC<AfterProps> = ({ text, changeNext }) => {
	return (
		<AfterWrap>
			<CopyButtonWrap>
				<CopyButton text={text} title="テーマをコピー" />
			</CopyButtonWrap>
			<NextButton onClick={changeNext} title="次のテーマを表示">
				<TfiReload />
			</NextButton>
		</AfterWrap>
	);
};
const AfterWrap = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
  grid-auto-flow: column;
  padding: 0 8px;
  gap: 8px;
`;
const CopyButtonWrap = styled.div`
  height: 24px;
  width: 24px;
  font-size: 24px;
`;
const NextButton = styled.button`
  height: 24px;
  width: 24px;
  font-size: 24px;

  color: ${({ theme }) => theme.theme.basic.accent.primary.default};
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.1s ease-out;
  border-radius: 4px;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: 1px solid
      ${({ theme }) => theme.theme.basic.accent.primary.default};
    outline-offset: 4px;
  }
`;

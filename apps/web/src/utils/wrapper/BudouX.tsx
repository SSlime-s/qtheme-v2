import { css } from "@emotion/react";
import { loadDefaultJapaneseParser } from "budoux";
import React, { useMemo } from "react";

import { WrapResolver } from "@/utils/wrapper";

import type { IWrapper } from "@/utils/wrapper";
import type { PropsWithChildren } from "react";

const parser = loadDefaultJapaneseParser();

type Props = IWrapper;

export const BudouJa: React.FC<PropsWithChildren<Props>> = ({
	children,
	Wrapper,
}) => {
	const parsed = useMemo(() => {
		const result = parser.parse(children);
		return result.map((v, i) => {
			const wrapped = <WrapResolver Wrapper={Wrapper}>{v}</WrapResolver>;

			if (i === 0) {
				// FIXME
				// biome-ignore lint/suspicious/noArrayIndexKey: FIXME
				return <React.Fragment key={i}>{wrapped}</React.Fragment>;
			}
			return (
				// FIXME
				// biome-ignore lint/suspicious/noArrayIndexKey: FIXME
				<React.Fragment key={i}>
					<wbr />
					{wrapped}
				</React.Fragment>
			);
		});
	}, [Wrapper, children]);

	return <>{parsed}</>;
};
export const BreakStyle = css`
  word-break: keep-all;
  overflow-wrap: break-word;
`;

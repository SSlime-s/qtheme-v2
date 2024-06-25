import React from "react";

import { WrapResolver } from "@/utils/wrapper";

import type { IWrapper } from "@/utils/wrapper";
import type { PropsWithChildren } from "react";

type Props = IWrapper;

export const ReplaceNewLine: React.FC<PropsWithChildren<Props>> = ({
  children,
  Wrapper,
}) => {
  const parsed = children.split(/(\n)/).map((v, i) => {
    if (v === "\n") {
      // FIXME
      // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
      return <br key={i} />;
    }

    const wrapped = <WrapResolver Wrapper={Wrapper}>{v}</WrapResolver>;
    // FIXME
    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
    return <React.Fragment key={i}>{wrapped}</React.Fragment>;
  });

  return <>{parsed}</>;
};

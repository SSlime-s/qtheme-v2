import styled from "@emotion/styled";
import { useMemo } from "react";
import { HiArrowRight } from "react-icons/hi";

import { useLoginUrl } from "@/utils/useLoginUrl";

import { GlassmorphismStyle } from "./Glassmorphism";
import { Forbidden } from "./svg/Forbidden";
import { NotFound } from "./svg/NotFound";
import { OtherError } from "./svg/OtherError";
import { Unauthorized } from "./svg/Unauthorized";

interface Props {
  color?: string;
  message?: string;
  statusCode?: number;
}
export const Error: React.FC<Props> = ({
  color,
  message: rawMessage,
  statusCode,
}) => {
  const Icon = useMemo(() => {
    if (statusCode === 404) {
      return NotFound;
    }
    if (statusCode === 403) {
      return Forbidden;
    }
    if (statusCode === 401) {
      return Unauthorized;
    }
    return OtherError;
  }, [statusCode]);

  const message =
    rawMessage ??
    (statusCode === 404
      ? "コンテンツが見つかりませんでした"
      : statusCode === 403
        ? "アクセス権限がありません"
        : statusCode === 401
          ? " 部員限定コンテンツです"
          : "予期せぬエラーが発生しました");

  const loginUrl = useLoginUrl();

  return (
    <Wrap>
      <Inner textColor={color}>
        <Icon color={color} size={256} />
        <Message>
          {message}
          {statusCode === 401 && (
            <>
              <LoginLink href={loginUrl}>
                すでに部員の方はこちら
                <HiArrowRight />
              </LoginLink>
            </>
          )}
        </Message>
      </Inner>
    </Wrap>
  );
};
const Wrap = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 100%;
`;
const Inner = styled.div<{ textColor?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ textColor, theme }) =>
    textColor ?? theme.theme.basic.ui.primary.default};
`;
const Message = styled.div`
  text-align: center;
`;
const LoginLink = styled.a`
  display: flex;
  ${GlassmorphismStyle}
  border-radius: 8px;
  padding: 12px 16px;
  align-items: center;
  vertical-align: middle;
  gap: 4px;
  line-height: 1;
  margin-top: 24px;
  margin-right: auto;
  color: #000;

  & > svg {
    transition: transform 0.2s ease-out;
  }
  &:hover > svg {
    transform: translateX(4px);
  }
`;

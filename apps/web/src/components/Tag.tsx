import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import type React from "react";
import { useMemo } from "react";

import { lightTheme } from "@repo/theme/default";

import { ColoredGlassmorphismStyle } from "./Glassmorphism";

import type { LinkProps as RawLinkProps } from "next/link";
import type { PropsWithChildren } from "react";

type Variant = "light" | "dark" | "other" | "private" | "public" | "draft";

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  tag: "a";
};

type LinkProps = RawLinkProps & {
  tag: "link";
};

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  tag: "button";
};

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  tag: "div";
};

type Props = (AnchorProps | ButtonProps | DivProps | LinkProps) & {
  variant: Variant;
};

interface Color {
  from: string;
  to: string;
  text: string;
  border?: string;
}
const colorMap: Record<Variant, Color> = {
  light: {
    from: "rgba(255, 255, 255, 0.4)",
    to: "rgba(255, 255, 255, 0.2)",
    text: "#333",
  },
  dark: {
    from: "rgba(0, 60, 60, 0.4)",
    to: "rgba(0, 60, 60, 0.2)",
    text: "#fff",
  },
  other: {
    from: "rgba(255, 255, 255, 0.4)",
    to: "rgba(255, 255, 255, 0.2)",
    text: "#333",
  },
  public: {
    from: "rgba(40, 240, 228, 0.4)",
    to: "rgba(40, 240, 228, 0.2)",
    text: "#333",
  },
  private: {
    from: "rgba(255, 255, 255, 0.4)",
    to: "rgba(255, 255, 255, 0.2)",
    text: "#333",
  },
  draft: {
    from: "rgba(242, 100, 81, 0.4)",
    to: "rgba(242, 100, 81, 0.2)",
    text: "#333",
  },
};

export const Tag: React.FC<PropsWithChildren<Props>> = ({
  tag,
  children,
  variant,
  ...props
}) => {
  const baseStyle = useMemo(() => {
    return css`
      display: inline-block;
      place-items: center;
      ${ColoredGlassmorphismStyle(
        colorMap[variant].from,
        colorMap[variant].to,
        colorMap[variant].border,
      )}
      color: ${colorMap[variant].text};
      text-transform: uppercase;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    `;
  }, [variant]);
  const style = useMemo(() => {
    return css`
      ${baseStyle}
      padding: 4px 8px;
      border-radius: 8px;

      transition: all 0.1s ease-in-out;
      transition-property: transform, color, background-color;

      ${
        tag !== "div"
          ? css`
            cursor: pointer;
            &:hover {
              transform: scale(1.05);
            }

            &:focus {
              outline: 1px solid ${lightTheme.basic.accent.primary};
              outline-offset: 1px;
            }
          `
          : ""
      }
    `;
  }, [tag, baseStyle]);

  const Tag = useMemo(() => {
    return tag === "link" ? styled(Link)(style) : styled(tag)(style);
  }, [tag, style]);

  // @ts-expect-error: Tag と props の整合性が型レベルではうまくとれなかった
  return <Tag {...props}>{children}</Tag>;
};

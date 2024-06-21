import type { Theme } from "@/index";

export const lightTheme = {
  version: 2,
  basic: {
    accent: {
      primary: "#005BAC",
      notification: "#F2994A",
      online: "#28F0E4",
      error: "#F26451",
      focus: "#005BACC0",
    },
    background: {
      primary: "#FFFFFF",
      secondary: "#F0F2F5",
      tertiary: "#E2E5E9",
    },
    ui: {
      primary: "#49535B",
      secondary: "#6B7D8A",
      tertiary: "#CED6DB",
    },
    text: {
      primary: "#333333",
      secondary: "#79797A",
    },
  },
} as const satisfies Theme;

export const darkTheme = {
  version: 2,
  basic: {
    accent: {
      primary: "#4899F9",
      notification: "#F2994A",
      online: "#28F0E4",
      error: "#F26451",
      focus: "#4899F9C0",
    },
    background: {
      primary: "#242B33",
      secondary: "#1E262E",
      tertiary: "#1A242D",
    },
    ui: {
      primary: "#F2F5F8",
      secondary: "#C7D0D9",
      tertiary: "#8795A3",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#BAC2C9",
    },
  },
  specific: {
    stampEdgeEnable: true,
  },
} as const satisfies Theme;

export const lightTitle = "traQ Light";
export const darkTitle = "traQ Dark";

export const lightDescription = "traQのデフォルトのライトテーマです。";
export const darkDescription = "traQのデフォルトのダークテーマです。";

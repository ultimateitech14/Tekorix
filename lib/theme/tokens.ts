export const themeTokens = {
  colors: {
    page: "#CFE3FF",
    primary: "#1B66B3",
    primaryDark: "#0F172A",
    accent: "#378FDD",
    surfaceAlt: "#C6E0FF",
    surfaceMuted: "#B5D5F8",
    surfaceCard: "#DCEEFF",
    border: "#7FB5EA",
    text: "#0F172A",
    textMuted: "#475569",
    white: "#FFFFFF",
  },
} as const;

export type ThemeTokens = typeof themeTokens;

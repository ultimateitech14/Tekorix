export const themeTokens = {
  colors: {
    page: "#E6F1FF",
    primary: "#1B66B3",
    primaryDark: "#0F172A",
    accent: "#378FDD",
    surfaceAlt: "#E6F1FF",
    surfaceMuted: "#D4E8FC",
    surfaceCard: "#F8FBFF",
    border: "#BED9F3",
    text: "#0F172A",
    textMuted: "#475569",
    white: "#FFFFFF",
  },
} as const;

export type ThemeTokens = typeof themeTokens;

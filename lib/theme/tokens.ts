export const themeTokens = {
  colors: {
    page: "#EEF5FF",
    primary: "#3E7FC1",
    primaryDark: "#0F172A",
    accent: "#6FAFE8",
    surfaceAlt: "#E6F0FF",
    surfaceMuted: "#DCEBFB",
    surfaceCard: "#F8FBFF",
    border: "#CFE0F5",
    text: "#0F172A",
    textMuted: "#475569",
    white: "#FFFFFF",
  },
} as const;

export type ThemeTokens = typeof themeTokens;

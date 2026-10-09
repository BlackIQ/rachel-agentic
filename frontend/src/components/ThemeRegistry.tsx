"use client";

import { useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: true,
        palette: {
          mode: prefersDark ? "dark" : "light",
          primary: {
            main: prefersDark ? "#6bcf9a" : "#1b7a4a",
            light: prefersDark ? "#9ae4bc" : "#2d9a62",
            dark: prefersDark ? "#3d9a6e" : "#0f5c36",
            contrastText: prefersDark ? "#06140c" : "#ffffff",
          },
          secondary: {
            main: prefersDark ? "#8fd4b0" : "#2e6b4f",
          },
          background: {
            default: prefersDark ? "#0a100d" : "#f3f6f4",
            paper: prefersDark ? "#121a16" : "#ffffff",
          },
          text: {
            primary: prefersDark ? "#e6efe9" : "#122018",
            secondary: prefersDark ? "#8fa399" : "#4d6358",
          },
          divider: prefersDark
            ? "rgba(140, 180, 155, 0.12)"
            : "rgba(20, 50, 35, 0.10)",
          action: {
            hover: prefersDark
              ? "rgba(107, 207, 154, 0.08)"
              : "rgba(27, 122, 74, 0.06)",
            selected: prefersDark
              ? "rgba(107, 207, 154, 0.14)"
              : "rgba(27, 122, 74, 0.10)",
          },
          success: { main: "#6bcf9a" },
          error: { main: "#e57373" },
        },
        shape: {
          borderRadius: 6,
        },
        typography: {
          fontFamily:
            'Inter, Roboto, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
          h5: { fontWeight: 700, letterSpacing: "-0.02em" },
          body1: { lineHeight: 1.65 },
          body2: { lineHeight: 1.55 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 6,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: { borderRadius: 6 },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: { backgroundImage: "none" },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: { backgroundImage: "none" },
            },
          },
        },
      }),
    [prefersDark],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

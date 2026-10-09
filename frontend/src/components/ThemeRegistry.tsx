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
            main: prefersDark ? "#7c9cff" : "#3d5afe",
            light: prefersDark ? "#a8bfff" : "#6b7fff",
            dark: prefersDark ? "#5a7ae6" : "#2a3eb1",
            contrastText: prefersDark ? "#0b0d12" : "#ffffff",
          },
          secondary: {
            main: prefersDark ? "#9b8cff" : "#7c4dff",
          },
          background: {
            default: prefersDark ? "#0c0e12" : "#f4f5f8",
            paper: prefersDark ? "#14171e" : "#ffffff",
          },
          text: {
            primary: prefersDark ? "#e8eaef" : "#151821",
            secondary: prefersDark ? "#9aa3b5" : "#5c6578",
          },
          divider: prefersDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(20,30,50,0.10)",
          success: { main: "#5dcea0" },
          error: { main: "#f07178" },
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily:
            'Inter, Roboto, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
          h4: { fontWeight: 700, letterSpacing: "-0.02em" },
          h6: { fontWeight: 600 },
          body1: { lineHeight: 1.65 },
          body2: { lineHeight: 1.55 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 12,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: { borderRadius: 12 },
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

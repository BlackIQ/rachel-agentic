"use client";

import { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: true,
        palette: {
          mode: "dark",
          primary: {
            main: "#7c9cff",
            light: "#a8bfff",
            dark: "#5a7ae6",
            contrastText: "#0b0d12",
          },
          secondary: {
            main: "#9b8cff",
          },
          background: {
            default: "#0c0e12",
            paper: "#14171e",
          },
          text: {
            primary: "#e8eaef",
            secondary: "#9aa3b5",
          },
          divider: "rgba(255,255,255,0.08)",
          success: {
            main: "#5dcea0",
          },
          error: {
            main: "#f07178",
          },
        },
        shape: {
          borderRadius: 14,
        },
        typography: {
          fontFamily:
            'Inter, Roboto, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
          h4: { fontWeight: 700, letterSpacing: "-0.02em" },
          h6: { fontWeight: 600 },
          body1: { lineHeight: 1.65 },
          body2: { lineHeight: 1.55 },
          caption: { letterSpacing: "0.02em" },
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
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

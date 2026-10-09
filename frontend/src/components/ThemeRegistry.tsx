"use client";

import { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: true,
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? "#90b4ff" : "#315fce",
          },
          background: {
            default: prefersDarkMode ? "#101114" : "#f7f8fa",
            paper: prefersDarkMode ? "#191b20" : "#ffffff",
          },
          divider: prefersDarkMode
            ? "rgba(255,255,255,0.09)"
            : "rgba(20,30,50,0.10)",
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: "Roboto, Arial, sans-serif",
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

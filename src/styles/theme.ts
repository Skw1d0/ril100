"use client";

import { createTheme } from "@mui/material";
// import { deDE } from "@mui/x-data-grid/locales";

export const THEME = {
  Light: 0,
  Dark: 1,
} as const;

export type THEME = (typeof THEME)[keyof typeof THEME];

export const lightTheme = createTheme(
  {
    palette: {
      primary: {
        light: "#878C96",
        main: "#282D37",
        dark: "#131821",
      },
      secondary: {
        light: "#F75056",
        main: "#EC0016",
        dark: "#9B000E",
      },
      info: {
        light: "#FACA7F",
        main: "#F39200",
        dark: "#C05E00",
      },
      success: {
        light: "#8CBC80",
        main: "#408335",
        dark: "#165C27",
      },
      background: {
        default: "#eff3f6",
      },
      mode: "light",
    },
  }
  // deDE
);

export const darkTheme = createTheme(
  {
    palette: {
      // primary: {
      //   light: "#878C96",
      //   main: "#3C414B",
      //   dark: "#282D37",
      // },
      primary: {
        light: "#ffffffff",
        main: "#d6d6d6ff",
        dark: "#b4b4b4ff",
      },
      secondary: {
        light: "#F75056",
        main: "#EC0016",
        dark: "#9B000E",
      },
      info: {
        light: "#FACA7F",
        main: "#F39200",
        dark: "#C05E00",
      },
      success: {
        light: "#8CBC80",
        main: "#408335",
        dark: "#165C27",
      },
      background: {
        default: "#131821",
        paper: "#282D37",
      },
      mode: "dark",
    },
  }
  // deDE
);

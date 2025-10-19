import "./App.css";

import Navbar from "./components/navbar";
import ResultList from "./components/result-list";
import { useState } from "react";
import { Box } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, THEME } from "./styles/theme";
import { findBetriebstellen, type Betriebsstelle } from "./tools/data";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [results, setResults] = useState<Betriebsstelle[]>([]);
  const [theme, setTheme] = useState<THEME>(
    prefersDarkMode ? THEME.Dark : THEME.Light
  );

  function search(value: string) {
    setResults(findBetriebstellen(value).slice(0, 10));
  }

  return (
    <ThemeProvider theme={theme == THEME.Dark ? darkTheme : lightTheme}>
      <CssBaseline />

      <Navbar
        currentTheme={theme}
        changeTheme={setTheme}
        searchFunction={search}
      />
      <Box component="main" sx={{ flex: 1 }}>
        <ResultList results={results} />
      </Box>
    </ThemeProvider>
  );
}

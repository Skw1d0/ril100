import {
  searchBetriebsstellen,
  type Betriebsstelle,
} from "./tools/betriebsstellen";
import "./App.css";

import Navbar from "./components/navbar";
import ResultList from "./components/result-list";
import { useState } from "react";
import { Stack } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, THEME } from "./styles/theme";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [results, setResults] = useState<Betriebsstelle[]>([]);
  const [theme, setTheme] = useState<THEME>(
    prefersDarkMode ? THEME.Dark : THEME.Light
  );

  function search(value: string) {
    setResults(searchBetriebsstellen(value).slice(0, 10));
  }

  return (
    <ThemeProvider theme={theme == THEME.Dark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Stack direction={"column"} spacing={9}>
        <Navbar
          currentTheme={theme}
          changeTheme={setTheme}
          searchFunction={search}
        />
        <ResultList results={results} />
      </Stack>
    </ThemeProvider>
  );
}

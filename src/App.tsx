import "./App.css";

import Navbar from "./components/navbar";
import ResultList from "./components/result-list";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, THEME } from "./styles/theme";
import { findBetriebstellen, type Betriebsstelle } from "./tools/data";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Betriebsstelle[]>([]);
  const [theme, setTheme] = useState<THEME>(
    prefersDarkMode ? THEME.Dark : THEME.Light
  );

  useEffect(() => {
    setResults(findBetriebstellen(searchTerm).slice(0, 10));
  }, [searchTerm]);

  return (
    <ThemeProvider theme={theme == THEME.Dark ? darkTheme : lightTheme}>
      <CssBaseline />

      <Navbar
        searchTerm={searchTerm}
        currentTheme={theme}
        setSearchTerm={setSearchTerm}
        changeTheme={setTheme}
      />
      <Box component="main" sx={{ flex: 1 }}>
        <ResultList results={results} setSearchTerm={setSearchTerm} />
      </Box>
    </ThemeProvider>
  );
}

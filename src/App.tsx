import "./App.css";

import ResultList from "./components/result-list";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, THEME } from "./styles/theme";
import {
  findBetriebstellen,
  findStrecke,
  type Betriebsstelle,
  type Strecke,
} from "./tools/data";
// import Search from "./components/Search";
import Navbar from "./components/navbar";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [theme, setTheme] = useState<THEME>(
    prefersDarkMode ? THEME.Dark : THEME.Light
  );
  const [searchString, setSearchString] = useState("");
  const [results, setResults] = useState<Betriebsstelle[] | Strecke[]>([]);
  const [isStrecke, setIsStrecke] = useState(false);

  useEffect(() => {
    const onlyDigits = /^\d+$/;
    if (onlyDigits.test(searchString)) {
      setIsStrecke(true);
      setResults(findStrecke(Number(searchString)));
    } else {
      setIsStrecke(false);
      setResults(findBetriebstellen(searchString).slice(0, 10));
    }
  }, [searchString]);

  return (
    <ThemeProvider theme={theme == THEME.Dark ? darkTheme : lightTheme}>
      <CssBaseline />

      <Navbar
        searchString={searchString}
        currentTheme={theme}
        setSearchString={setSearchString}
        changeTheme={setTheme}
      />
      {/* <Search
        searchTerm={searchTerm}
        currentTheme={theme}
        setSearchTerm={setSearchTerm}
        changeTheme={setTheme}
      /> */}
      <Box component="main" sx={{ flex: 1 }}>
        <ResultList
          isStrecke={isStrecke}
          results={results}
          setSearchString={setSearchString}
        />
      </Box>
    </ThemeProvider>
  );
}

import "./App.css";
import "leaflet/dist/leaflet.css";

import ResultList from "./components/result-list";
import { useEffect, useState } from "react";
import { Box, Drawer, IconButton, type BoxProps } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, THEME } from "./styles/theme";
import {
  findBetriebstellen,
  findStrecke,
  type Betriebsstelle,
  type Strecke,
} from "./tools/data";

import Navbar from "./components/navbar";
import Map from "./components/map";
import { Close } from "@mui/icons-material";

// const drawerWidth = 800;

interface MainProps extends BoxProps {
  open: boolean;
  drawerWidth: number;
}

const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<MainProps>(({ theme, open, drawerWidth }) => ({
  // width: "100%",
  // marginRight: 0,
  padding: 10,
  boxSizing: "border-box",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: open ? `calc(100% - ${drawerWidth}px)` : "100&",
  marginRight: open ? drawerWidth : 0,
  // variants: [
  //   {
  //     props: ({ open }) => open,
  //     style: {
  //       width: `calc(100% - ${drawerWidth}px)`,
  //       marginRight: `${drawerWidth}px`,
  //       transition: theme.transitions.create(["margin", "width"], {
  //         easing: theme.transitions.easing.easeOut,
  //         duration: theme.transitions.duration.enteringScreen,
  //       }),
  //     },
  //   },
  // ],
}));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[200],
  backgroundColor: theme.palette.grey[900],
  "&:hover": {
    backgroundColor: theme.darken(theme.palette.grey[900], 0.25),
  },
}));

function useWindowWidth(
  initial = typeof window !== "undefined" ? window.innerWidth : 0
) {
  const [width, setWidth] = useState<number>(initial);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const windowWidth = useWindowWidth();

  const [theme, setTheme] = useState<THEME>(
    prefersDarkMode ? THEME.Dark : THEME.Light
  );
  const [mapOpen, setMapOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [isStrecke, setIsStrecke] = useState(false);
  const [results, setResults] = useState<Betriebsstelle[] | Strecke[]>([]);
  const [mapView, setMapView] = useState<{
    center: [number, number];
    zoom: number;
  } | null>(null);
  const [drawerWidth, setDrawerWidth] = useState<number>(() => {
    if (windowWidth < 1160) return windowWidth;
    else if (windowWidth <= 1360) return 400;
    else if (windowWidth <= 1560) return 600;
    else if (windowWidth > 1560) return 800;
    else return 800;
  });

  useEffect(() => {
    if (windowWidth < 1160) setDrawerWidth(windowWidth);
    else if (windowWidth <= 1360) setDrawerWidth(400);
    else if (windowWidth <= 1560) setDrawerWidth(600);
    else if (windowWidth > 1560) setDrawerWidth(800);
    else setDrawerWidth(800);
  }, [windowWidth]);

  useEffect(() => {
    const onlyDigits = /^\d+$/;
    if (onlyDigits.test(searchString)) {
      const result = findStrecke(Number(searchString));
      setIsStrecke(true);
      setResults(result);

      const strecken = result as Strecke[];
      const first = strecken[0];
      if (first?.betriebsstelle?.geo_koordinaten) {
        setMapView({
          center: [
            first.betriebsstelle.geo_koordinaten.breite,
            first.betriebsstelle.geo_koordinaten.laenge,
          ],
          zoom: 17,
        });
      }
    } else {
      const results = findBetriebstellen(searchString).slice(0, 10);
      setIsStrecke(false);
      setResults(results);
      if ((results as Betriebsstelle[])[0]?.geo_koordinaten) {
        setMapView({
          center: [
            results[0].geo_koordinaten.breite,
            results[0].geo_koordinaten.laenge,
          ],
          zoom: 17,
        });
      }
    }
  }, [searchString]);

  return (
    <ThemeProvider theme={theme == THEME.Dark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Drawer
        open={mapOpen}
        variant="persistent"
        anchor="right"
        sx={{
          position: "relative",
          width: drawerWidth,
        }}
      >
        <Box sx={{ width: drawerWidth, height: "100vh", position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 2000,
            }}
          >
            <StyledCloseButton onClick={() => setMapOpen(false)}>
              <Close />
            </StyledCloseButton>
          </Box>

          <Box sx={{ width: "100%", height: "100%", paddingLeft: 0.05 }}>
            <Map mapView={mapView} />
          </Box>
        </Box>
      </Drawer>

      <Navbar
        searchString={searchString}
        currentTheme={theme}
        mapOpen={mapOpen}
        drawerWidth={drawerWidth}
        setSearchString={setSearchString}
        changeTheme={setTheme}
      />
      <Main open={mapOpen} drawerWidth={drawerWidth}>
        <Box sx={{ marginTop: 8 }}>
          <ResultList
            isStrecke={isStrecke}
            results={results}
            setMapOpen={setMapOpen}
            setSearchString={setSearchString}
            setMapView={setMapView}
          />
        </Box>
      </Main>
    </ThemeProvider>
  );
}

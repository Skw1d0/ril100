import "./App.css";
import "leaflet/dist/leaflet.css";

import ResultList from "./components/result-list";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
  type BoxProps,
  type IconButtonProps,
} from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, THEME } from "./styles/theme";
import {
  findBst,
  findMilestoneFromOpenrailway,
  getDataInfo,
  type Betriebsstelle,
} from "./tools/data";

import Navbar from "./components/navbar";
import Map, { type Position, type Style } from "./components/map";
import { Bolt, Close, Speed, Traffic, Train } from "@mui/icons-material";

interface MainProps extends BoxProps {
  open: boolean;
  drawerWidth: number;
}

interface IconProps extends IconButtonProps {
  active: boolean;
}

const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<MainProps>(({ theme, open, drawerWidth }) => ({
  padding: 10,
  boxSizing: "border-box",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: open ? `calc(100% - ${drawerWidth}px)` : "100&",
  marginRight: open ? drawerWidth : 0,
  flex: 1,
}));

const Footer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<MainProps>(({ theme, open, drawerWidth }) => ({
  boxSizing: "border-box",

  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: open ? `calc(100% - ${drawerWidth}px)` : "100&",
  marginRight: open ? drawerWidth : 0,
  marginTop: "auto",
}));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[200],
  backgroundColor: theme.palette.grey[900],
  "&:hover": {
    backgroundColor: theme.darken(theme.palette.grey[900], 0.25),
  },
}));

const StyledMapIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<IconProps>(({ theme, active }) => ({
  color: theme.palette.grey[900],
  backgroundColor: active ? theme.palette.grey[400] : theme.palette.grey[100],
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: theme.palette.grey[500],
  "&:hover": {
    backgroundColor: theme.darken(
      active ? theme.palette.grey[400] : theme.palette.grey[100],
      0.05
    ),
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
  const windowWidth = useWindowWidth();
  const hasSetInitialPosition = useRef(false);

  const { anzeigename, gueltig_von, gueltig_bis } = getDataInfo();

  const [theme, setTheme] = useState<THEME>(
    window.localStorage.getItem("theme") === null ||
      window.localStorage.getItem("theme") === "0"
      ? THEME.Light
      : THEME.Dark
  );
  const [mapOpen, setMapOpen] = useState(windowWidth >= 1160 ? true : false);
  const [compactView, setCompactView] = useState<boolean>(
    window.localStorage.getItem("compactView") === null ||
      window.localStorage.getItem("compactView") === "0"
      ? false
      : true
  );
  const [searchString, setSearchString] = useState("");
  const [searchStringKm, setSearchStringKm] = useState("");
  const [results, setResults] = useState<Betriebsstelle[]>([]);
  const [mapPosition, setMapPosition] = useState<Position>({
    center: [0, 0],
    zoom: 17,
  });
  const [mapStyle, setMapStyle] = useState<Style>("standard");
  const [drawerWidth, setDrawerWidth] = useState<number>(() => {
    if (windowWidth < 1160) return windowWidth;
    else if (windowWidth <= 1360) return 400;
    else if (windowWidth <= 1560) return 600;
    else if (windowWidth > 1560) return 800;
    else return 800;
  });

  const changeTheme = (value: THEME) => {
    window.localStorage.setItem("theme", value.toString());
    setTheme(value);
  };

  const changeCompactView = (value: boolean) => {
    window.localStorage.setItem("compactView", value ? "1" : "0");
    setCompactView(value);
  };

  const changeMapStyle = (value: Style) => {
    setMapStyle(value);
  };

  useEffect(() => {
    if (windowWidth < 1160) setDrawerWidth(windowWidth);
    else if (windowWidth <= 1360) setDrawerWidth(400);
    else if (windowWidth <= 1560) setDrawerWidth(600);
    else if (windowWidth > 1560) setDrawerWidth(800);
    else setDrawerWidth(800);
  }, [windowWidth]);

  useEffect(() => {
    if (searchString && searchStringKm) {
      findMilestoneFromOpenrailway(searchString, searchStringKm).then((e) => {
        setResults(e);
      });
    } else {
      setResults(findBst(searchString));
    }
  }, [searchString, searchStringKm]);

  useEffect(() => {
    if (results.length <= 0 || hasSetInitialPosition.current) return;
    const initPosition: Position = {
      center: [
        results[0].geo_koordinaten.breite,
        results[0].geo_koordinaten.laenge,
      ],
      zoom: 17,
    };
    setMapPosition(initPosition);
    hasSetInitialPosition.current = true;
  }, [results]);

  return (
    <ThemeProvider theme={theme == THEME.Dark ? darkTheme : lightTheme}>
      <CssBaseline />

      <Box
        sx={{
          height: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Drawer
          open={mapOpen}
          variant="persistent"
          anchor="right"
          sx={{
            position: "relative",
            width: drawerWidth,
          }}
        >
          <Box
            sx={{ width: drawerWidth, height: "100vh", position: "relative" }}
          >
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
            <Box sx={{ position: "absolute", top: 90, left: 8, zIndex: 2000 }}>
              <Stack direction={"column"} spacing={1}>
                <StyledMapIconButton
                  active={mapStyle === "standard"}
                  onClick={() => changeMapStyle("standard")}
                >
                  <Train />
                </StyledMapIconButton>
                <StyledMapIconButton
                  active={mapStyle === "signals"}
                  onClick={() => changeMapStyle("signals")}
                >
                  <Traffic />
                </StyledMapIconButton>
                <StyledMapIconButton
                  active={mapStyle === "maxspeed"}
                  onClick={() => changeMapStyle("maxspeed")}
                >
                  <Speed />
                </StyledMapIconButton>
                <StyledMapIconButton
                  active={mapStyle === "electrification"}
                  onClick={() => changeMapStyle("electrification")}
                >
                  <Bolt />
                </StyledMapIconButton>
              </Stack>
            </Box>

            <Box sx={{ width: "100%", height: "100%", paddingLeft: 0.05 }}>
              <Map view={mapPosition} style={mapStyle} />
            </Box>
          </Box>
        </Drawer>

        <Navbar
          searchString={searchString}
          searchStringKm={searchStringKm}
          currentTheme={theme}
          mapOpen={mapOpen}
          compactView={compactView}
          drawerWidth={drawerWidth}
          setSearchString={setSearchString}
          setSearchStringKm={setSearchStringKm}
          setTheme={changeTheme}
          setCompactView={changeCompactView}
        />

        <Main open={mapOpen} drawerWidth={drawerWidth}>
          <Box sx={{ marginTop: 8 }}>
            {results.length > 0 && (
              <ResultList
                // isStrecke={isStrecke}
                results={results}
                compactView={compactView}
                setMapOpen={setMapOpen}
                setSearchString={setSearchString}
                setMapView={setMapPosition}
              />
            )}
          </Box>
        </Main>

        {results.length > 0 && (
          <Footer
            open={mapOpen}
            drawerWidth={drawerWidth}
            // sx={{ backgroundColor: "yellow" }}
          >
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: 1,
                borderRadius: 0,
              }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                divider={
                  <Divider orientation="vertical" variant="middle" flexItem />
                }
                sx={{
                  width: {
                    xs: "calc(100% - 10px)",
                    sm: 600,
                    md: 900,
                  },
                }}
              >
                <Typography
                  color="textDisabled"
                  fontSize={"0.8em"}
                  fontWeight={100}
                >
                  {anzeigename}
                </Typography>
                <Typography
                  color="textDisabled"
                  fontSize={"0.8em"}
                  fontWeight={100}
                >
                  {`Gültig von ${dayjs(gueltig_von).date()}.${dayjs(
                    gueltig_von
                  ).month()}.${dayjs(gueltig_von).year()} bis ${dayjs(
                    gueltig_bis
                  ).date()}.${dayjs(gueltig_bis).month()}.${dayjs(
                    gueltig_bis
                  ).year()}`}
                </Typography>
              </Stack>
            </Paper>
          </Footer>
        )}
      </Box>
    </ThemeProvider>
  );
}

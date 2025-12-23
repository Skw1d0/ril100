import {
  AppBar,
  Box,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Toolbar,
  useTheme,
  type AppBarProps,
} from "@mui/material";
// import Logo from "../assets/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import {
  Cancel,
  DarkMode,
  LightMode,
  ViewAgenda,
  ViewHeadline,
} from "@mui/icons-material";

import { THEME } from "../styles/theme";

interface NavbarPrpos {
  searchString: string;
  searchStringKm: string;
  currentTheme: THEME;
  mapOpen: boolean;
  compactView: boolean;
  drawerWidth: number;
  setSearchString: (value: string) => void;
  setSearchStringKm: (value: string) => void;
  setTheme: (value: THEME) => void;
  setCompactView: (value: boolean) => void;
}

interface StyledAppBarProps extends AppBarProps {
  mapOpen: boolean;
  drawerWidth: number;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "mapOpen" && prop !== "drawerWidth",
})<StyledAppBarProps>(({ theme, drawerWidth, mapOpen }) => ({
  left: "auto",
  right: "auto",
  backgroundColor: theme.palette.background.paper,
  boxSizing: "border-box",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: mapOpen ? `calc(100vw - ${drawerWidth}px)` : "100vw",
  marginRight: mapOpen ? `${drawerWidth}px` : "0px",
}));

const onlyDigits = /^\d+$/;

function Navbar({
  searchString,
  searchStringKm,
  currentTheme,
  mapOpen,
  compactView,
  drawerWidth,
  setSearchString,
  setSearchStringKm,
  setTheme,
  setCompactView,
}: NavbarPrpos) {
  const theme = useTheme();
  return (
    <StyledAppBar mapOpen={mapOpen} drawerWidth={drawerWidth}>
      <Toolbar
        sx={{
          width: {
            xs: "100%",
            sm: mapOpen ? "100%" : 600,
            md: mapOpen ? "100%" : 900,
            lg: mapOpen ? "100%" : 900,
            xl: mapOpen ? 900 : 900,
          },
          mx: "auto",
        }}
      >
        {/* <Toolbar> */}
        {/* <img src={Logo} width={48} /> */}
        <TextField
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchString && (
                    <IconButton
                      sx={{ color: theme.palette.primary.main }}
                      onClick={() => setSearchString("")}
                    >
                      <Cancel />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          }}
          sx={{ mx: 2 }}
          placeholder="Betriebsstelle oder VzG"
          fullWidth
          variant="standard"
          onChange={(e) => setSearchString(e.target.value)}
          value={searchString}
        />
        {onlyDigits.test(searchString) && (
          <TextField
            value={searchStringKm}
            onChange={(e) => setSearchStringKm(e.target.value)}
            variant="standard"
            placeholder="km"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {searchString && (
                      <IconButton
                        sx={{ color: theme.palette.primary.main }}
                        onClick={() => setSearchStringKm("")}
                      >
                        <Cancel />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        <Box flexGrow={1} />
        <IconButton
          sx={{ color: theme.palette.primary.main }}
          onClick={() =>
            setTheme(currentTheme == THEME.Light ? THEME.Dark : THEME.Light)
          }
        >
          {currentTheme == THEME.Light ? <LightMode /> : <DarkMode />}
        </IconButton>
        <IconButton
          sx={{ color: theme.palette.primary.main }}
          onClick={() => setCompactView(!compactView)}
        >
          {compactView ? <ViewHeadline /> : <ViewAgenda />}
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;

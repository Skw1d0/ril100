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
import { Cancel, DarkMode, LightMode } from "@mui/icons-material";
import { THEME } from "../styles/theme";

// const drawerWidth = 800;

interface NavbarPrpos {
  searchString: string;
  currentTheme: THEME;
  mapOpen: boolean;
  drawerWidth: number;
  setSearchString: (value: string) => void;
  changeTheme: (value: THEME) => void;
}

// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   color: "inherit",
//   justifyContent: "center",
// }));

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

function Navbar({
  searchString: searchTerm,
  currentTheme,
  mapOpen: mapOpen,
  drawerWidth,
  setSearchString,
  changeTheme,
}: NavbarPrpos) {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
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
                    {searchTerm && (
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
            value={searchTerm}
          />
          <Box flexGrow={1} />
          <IconButton
            sx={{ color: theme.palette.primary.main }}
            onClick={() =>
              changeTheme(
                currentTheme == THEME.Light ? THEME.Dark : THEME.Light
              )
            }
          >
            {currentTheme == THEME.Dark ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}

export default Navbar;

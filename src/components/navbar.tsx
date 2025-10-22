import {
  AppBar,
  Box,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";
// import Logo from "../assets/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import { Cancel, DarkMode, LightMode } from "@mui/icons-material";
import { THEME } from "../styles/theme";

interface NavbarParams {
  searchString: string;
  currentTheme: THEME;
  setSearchString: (value: string) => void;
  changeTheme: (value: THEME) => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: "inherit",
  justifyContent: "center",
}));

function Navbar({
  searchString: searchTerm,
  currentTheme,
  setSearchString: setSearchTerm,
  changeTheme,
}: NavbarParams) {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar>
        <Toolbar sx={{ width: { xs: "100%", sm: 600, md: 900 }, mx: "auto" }}>
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
                        onClick={() => setSearchTerm("")}
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
            onChange={(e) => setSearchTerm(e.target.value)}
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

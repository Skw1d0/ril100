import {
  AppBar,
  Box,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Toolbar,
} from "@mui/material";
import Logo from "../assets/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import { DarkMode, LightMode } from "@mui/icons-material";
import { THEME } from "../styles/theme";

interface NavbarParams {
  searchTerm: string;
  currentTheme: THEME;
  setSearchTerm: (value: string) => void;
  changeTheme: (value: THEME) => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: "inherit",
  justifyContent: "center",
}));

function Navbar({
  searchTerm,
  currentTheme,
  setSearchTerm,
  changeTheme,
}: NavbarParams) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar>
        <Toolbar sx={{ width: { xs: "100%", sm: 600, md: 900 }, mx: "auto" }}>
          <img src={Logo} width={48} />

          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mx: 2 }}
            placeholder="Betriebsstelle"
            fullWidth
            variant="standard"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Box flexGrow={1} />
          <IconButton
            sx={{ color: "inherit" }}
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

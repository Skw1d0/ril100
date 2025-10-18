import {
  alpha,
  AppBar,
  Box,
  IconButton,
  InputBase,
  styled,
  Toolbar,
  useTheme,
} from "@mui/material";
import Logo from "../assets/logo.svg";
import { DarkMode, LightMode } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { THEME } from "../styles/theme";

interface NavbarParams {
  searchFunction: (value: string) => void;
  changeTheme: (value: THEME) => void;
  currentTheme: THEME;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: "100%",
  // [theme.breakpoints.down("sm")]: {
  //   marginLeft: theme.spacing(3),
  // },
  // [theme.breakpoints.up("sm")]: {
  //   marginLeft: theme.spacing(3),
  //   width: "auto",
  // },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function Navbar({ searchFunction, changeTheme, currentTheme }: NavbarParams) {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: "inherit",
        }}
      >
        <Toolbar>
          <img src={Logo} width={48} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Betriebsstelle..."
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => searchFunction(e.target.value)}
            />
          </Search>
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
      </AppBar>
    </Box>
  );
}

export default Navbar;

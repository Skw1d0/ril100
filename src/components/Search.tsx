import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { THEME } from "../styles/theme";
import SearchIcon from "@mui/icons-material/Search";
import { Cancel, DarkMode, LightMode } from "@mui/icons-material";

interface SearchFieldParams {
  searchTerm: string;
  currentTheme: THEME;
  setSearchTerm: (value: string) => void;
  changeTheme: (value: THEME) => void;
}

function Search({
  searchTerm,
  currentTheme,
  setSearchTerm,
  changeTheme,
}: SearchFieldParams) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        py: 1,
        width: "100%",
        borderBottom: 1,
        backgroundColor: theme.palette.background.default,
        borderColor: theme.palette.background.paper,
        zIndex: theme.zIndex.modal + 200,
      }}
    >
      <Box
        sx={{
          width: { xs: "calc(100% - 10px)", sm: 600, md: 900 },
          mx: "auto",
        }}
      >
        <TextField
          fullWidth
          placeholder="Betriebsstelle..."
          variant="outlined"
          sx={{
            // position: "fixed",
            // top: 10,
            // left: "50%",
            // transform: "translateX(-50%)",
            // width: { xs: "calc(100% - 10px)", sm: 600, md: 900 },
            backgroundColor: theme.palette.background.paper,
            // color: "inherit",
            // zIndex: theme.zIndex.modal + 200,
            borderRadius: "6px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              overflow: "hidden", // sorgt dafür, dass innere Rechtecke abgeschnitten werden
              backgroundColor: theme.palette.background.paper,
              boxShadow: "none",
              // "&:hover .MuiOutlinedInput-notchedOutline": {
              //   borderColor: "transparent",
              // },
              // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              //   borderColor: "transparent",
              // },
              "& .MuiOutlinedInput-notchedOutline": {
                // border: "none",
                borderRadius: "6px",
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction={"row"} spacing={1}>
                    {searchTerm && (
                      <IconButton
                        sx={{ color: theme.palette.primary.main }}
                        onClick={() => setSearchTerm("")}
                      >
                        <Cancel />
                      </IconButton>
                    )}
                    <IconButton
                      sx={{ color: theme.palette.primary.main }}
                      onClick={() =>
                        changeTheme(
                          currentTheme == THEME.Light ? THEME.Dark : THEME.Light
                        )
                      }
                    >
                      {currentTheme == THEME.Dark ? (
                        <LightMode />
                      ) : (
                        <DarkMode />
                      )}
                    </IconButton>
                  </Stack>
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </Box>
    </Box>
  );
}

export default Search;

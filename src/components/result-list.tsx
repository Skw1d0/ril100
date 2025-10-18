import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import type { Betriebsstelle } from "../tools/betriebsstellen";
import { DirectionsRailway, Map } from "@mui/icons-material";
import openAPN from "../tools/apn";
import { openOpenrailwaymaps } from "../tools/openrailway";

interface ResultListProps {
  results: Betriebsstelle[];
}

function ResultList({ results }: ResultListProps) {
  return (
    <Box sx={{ px: 1 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody sx={{ display: { xs: "table-row-group", sm: "none" } }}>
            {results.map((result) => (
              <TableRow key={result.RL100Code}>
                <TableCell>{result.TypKurz}</TableCell>
                <TableCell>
                  <Stack direction={"column"} spacing={0}>
                    <Typography>{result.RL100Code}</Typography>
                    <Typography>{result.RL100Kurz}</Typography>
                    <Typography>{result.RL100Lang}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ justifyItems: "end" }}>
                  <Stack direction={"row"} spacing={0}>
                    <IconButton
                      sx={{ color: "inherit" }}
                      onClick={() => openAPN(result.RL100Code)}
                    >
                      <DirectionsRailway />
                    </IconButton>
                    <IconButton
                      sx={{ color: "inherit" }}
                      onClick={() => openOpenrailwaymaps(result.RL100Lang)}
                    >
                      <Map />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableBody
            sx={{ display: { xs: "none", sm: "table-row-group", md: "none" } }}
          >
            {results.map((result) => (
              <TableRow key={result.RL100Code}>
                <TableCell>{result.TypKurz}</TableCell>
                <TableCell>{result.RL100Code}</TableCell>
                <TableCell>
                  <Stack direction={"column"} spacing={0}>
                    <Typography>{result.RL100Kurz}</Typography>
                    <Typography>{result.RL100Lang}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ justifyItems: "end" }}>
                  <Stack direction={"row"} spacing={0}>
                    <IconButton
                      sx={{ color: "inherit" }}
                      onClick={() => openAPN(result.RL100Code)}
                    >
                      <DirectionsRailway />
                    </IconButton>
                    <IconButton
                      sx={{ color: "inherit" }}
                      onClick={() => openOpenrailwaymaps(result.RL100Lang)}
                    >
                      <Map />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableBody sx={{ display: { xs: "none", md: "table-row-group" } }}>
            {results.map((result) => (
              <TableRow key={result.RL100Code}>
                <TableCell>{result.TypKurz}</TableCell>
                <TableCell>{result.RL100Code}</TableCell>
                <TableCell>{result.RL100Kurz}</TableCell>
                <TableCell>{result.RL100Lang}</TableCell>
                <TableCell sx={{ justifyItems: "end" }}>
                  <Stack direction={"row"} spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => openAPN(result.RL100Code)}
                    >
                      APN
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => openOpenrailwaymaps(result.RL100Lang)}
                    >
                      Openrailwaymap
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ResultList;

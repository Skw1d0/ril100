import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Bolt, Map, PictureInPicture, Train } from "@mui/icons-material";
import { findStreckensegmente, type Betriebsstelle } from "../tools/data";
import {
  openAPN,
  openGoogleMaps,
  openOpenrailwaymaps,
} from "../tools/openWebsite";

interface ResultListProps {
  results: Betriebsstelle[];
  setSearchTerm: (value: string) => void;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.darken(theme.palette.primary.main, 0.25),
  },
}));

function ResultList({ results, setSearchTerm }: ResultListProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Stack
        direction={"column"}
        spacing={1}
        sx={{
          // px: 1,
          marginTop: 10,
          marginBottom: 3,
          width: { xs: "calc(100% - 10px)", sm: 600, md: 900 },
        }}
      >
        {results.map((result) => (
          <Card key={result.ds100}>
            <CardHeader
              title={
                <>
                  {result.betriebsstellentypen.map((bst) => {
                    if (bst === "bahnhof") return "Bf ";
                    if (bst === "bahnhofsteil") return "Bft ";
                    if (bst === "haltepunkt") return "Hp ";
                    if (bst === "abzweigstelle") return "Azwst ";
                    if (bst === "ueberleitstelle") return "Üst ";
                  })}
                  {result.langname}
                  {result.elektrifiziert && (
                    <Bolt sx={{ marginLeft: 1 }} color="warning" />
                  )}
                </>
              }
              subheader={result.ds100}
            />
            <CardContent>
              <TableContainer>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 100 }}>VzG</TableCell>
                      <TableCell sx={{ width: 300 }}>Von</TableCell>
                      <TableCell sx={{ width: 300 }}></TableCell>
                      <TableCell sx={{ width: 300 }}>Nach</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {findStreckensegmente(result.ds100).map((line) => (
                      <TableRow key={Math.random()}>
                        <TableCell>{line.streckennummer}</TableCell>
                        <TableCell>
                          <Stack direction={"column"} spacing={0}>
                            {line.von.segment && (
                              <>
                                <Link
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setSearchTerm(
                                      line.von.betriebsstelle?.langname || ""
                                    )
                                  }
                                >
                                  <Typography>
                                    {line.von.betriebsstelle?.langname}
                                  </Typography>
                                </Link>
                                <Typography fontWeight={100}>
                                  {line.von.segment.von_km.toFixed(3)}
                                </Typography>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction={"column"} spacing={0}>
                            <Typography>
                              {line.betriebsstelle?.langname}
                            </Typography>
                            <Typography fontWeight={100}>
                              {line.von.segment?.bis_km.toFixed(3) ||
                                line.bis.segment?.von_km.toFixed(3)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {line.bis.segment && (
                            <>
                              <Link
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setSearchTerm(
                                    line.bis.betriebsstelle?.langname || ""
                                  )
                                }
                              >
                                <Typography>
                                  {line.bis.betriebsstelle?.langname}
                                </Typography>
                              </Link>
                              <Typography fontWeight={100}>
                                {line.bis.segment.bis_km.toFixed(3)}
                              </Typography>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Box flexGrow={1} />
              <StyledIconButton
                disabled={!result.bahnhof}
                onClick={() => openAPN(result.ds100)}
              >
                <PictureInPicture />
              </StyledIconButton>
              <StyledIconButton
                disabled={!result.geo_koordinaten ? true : false}
                onClick={() =>
                  openOpenrailwaymaps(
                    result.geo_koordinaten.breite,
                    result.geo_koordinaten.laenge
                  )
                }
              >
                <Train />
              </StyledIconButton>
              <StyledIconButton
                disabled={!result.geo_koordinaten ? true : false}
                onClick={() =>
                  openGoogleMaps(
                    result.geo_koordinaten.breite,
                    result.geo_koordinaten.laenge
                  )
                }
              >
                <Map />
              </StyledIconButton>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default ResultList;

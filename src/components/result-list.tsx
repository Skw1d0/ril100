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
import { Bolt, LocationPin, Map, PictureInPicture } from "@mui/icons-material";
import {
  findStreckensegmente,
  type Betriebsstelle,
  type Strecke,
} from "../tools/data";
import { openAPN, openGoogleMaps } from "../tools/openWebsite";

interface ResultListProps {
  isStrecke: boolean;
  results: Betriebsstelle[] | Strecke[];
  compactView: boolean;
  setSearchString: (value: string) => void;
  setMapOpen: (value: boolean) => void;
  setMapView: (
    value: { center: [number, number]; zoom: number } | null
  ) => void;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.darken(theme.palette.primary.main, 0.25),
  },
}));

function ResultList({
  isStrecke,
  results,
  compactView,
  setSearchString,
  setMapOpen,
  setMapView,
}: ResultListProps) {
  return !isStrecke ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        direction={"column"}
        spacing={1}
        sx={{
          width: { xs: "calc(100% - 10px)", sm: 600, md: 900 },
        }}
      >
        {(results as Betriebsstelle[]).map((result) => (
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
            {!compactView && (
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
                          <TableCell sx={{ alignContent: "start" }}>
                            <Link
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setSearchString(String(line.streckennummer))
                              }
                            >
                              {line.streckennummer}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Stack direction={"column"} spacing={0}>
                              {line.von.segment && (
                                <>
                                  <Link
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setSearchString(
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
                              <Link
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setSearchString(
                                    line.betriebsstelle?.langname || ""
                                  )
                                }
                              >
                                <Typography>
                                  {line.betriebsstelle?.langname}
                                </Typography>
                              </Link>
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
                                    setSearchString(
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
            )}
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
                onClick={() => {
                  setMapOpen(true);
                  setMapView({
                    center: [
                      result.geo_koordinaten.breite,
                      result.geo_koordinaten.laenge,
                    ],
                    zoom: 17,
                  });
                }}
              >
                <LocationPin />
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
  ) : (
    (results as Strecke[]).length > 0 && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: { xs: "calc(100% - 10px)", sm: 600, md: 900 },
          }}
        >
          <CardHeader
            title={(results as Strecke[])[0].streckennummer}
            subheader={`${
              (results as Strecke[])[0].betriebsstelle?.langname
            } - ${
              (results as Strecke[])[(results as Strecke[]).length - 1]
                .betriebsstelle?.langname
            }`}
          />
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 600 }}>Betriebsstelle</TableCell>
                    <TableCell sx={{ width: 150 }}>km</TableCell>
                    <TableCell sx={{ width: 100 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(results as Strecke[]).map((result) => (
                    <TableRow key={`1` + Math.random()}>
                      <TableCell>
                        <Stack
                          direction={"row"}
                          spacing={1}
                          display={"flex"}
                          alignItems={"center"}
                        >
                          <Link
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setSearchString(
                                result.betriebsstelle?.langname || ""
                              )
                            }
                          >
                            <Typography>
                              {result.betriebsstelle?.betriebsstellentypen.map(
                                (bst) => {
                                  if (bst === "bahnhof") return "Bf ";
                                  if (bst === "bahnhofsteil") return "Bft ";
                                  if (bst === "haltepunkt") return "Hp ";
                                  if (bst === "abzweigstelle") return "Azwst ";
                                  if (bst === "ueberleitstelle") return "Üst ";
                                }
                              )}
                              {result.betriebsstelle?.langname}
                            </Typography>
                          </Link>
                          <Typography>
                            {" (" + result.betriebsstelle?.ds100 + ")"}
                          </Typography>
                          {result.betriebsstelle?.elektrifiziert && (
                            <Bolt color="warning" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>{result.km.toFixed(3)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} justifyContent="end">
                          <StyledIconButton
                            disabled={!result.betriebsstelle?.bahnhof}
                            onClick={() =>
                              openAPN(result.betriebsstelle?.ds100)
                            }
                          >
                            <PictureInPicture />
                          </StyledIconButton>
                          {result.betriebsstelle && (
                            <StyledIconButton
                              disabled={
                                !result.betriebsstelle?.geo_koordinaten
                                  ? true
                                  : false
                              }
                              onClick={() => {
                                const geo =
                                  result.betriebsstelle?.geo_koordinaten;
                                if (!geo) return;
                                setMapOpen(true);
                                setMapView({
                                  center: [geo.breite, geo.laenge],
                                  zoom: 17,
                                });
                              }}
                            >
                              <LocationPin />
                            </StyledIconButton>
                          )}
                          <StyledIconButton
                            disabled={
                              !result.betriebsstelle?.geo_koordinaten
                                ? true
                                : false
                            }
                            onClick={() =>
                              openGoogleMaps(
                                result.betriebsstelle?.geo_koordinaten.breite,
                                result.betriebsstelle?.geo_koordinaten.laenge
                              )
                            }
                          >
                            <Map />
                          </StyledIconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    )
  );
}

export default ResultList;

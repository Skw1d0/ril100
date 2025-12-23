import data from "./data.json";

export interface GeoKoordinaten {
  breite: number;
  laenge: number;
}

export interface Betriebsstelle {
  x: number;
  y: number;
  ds100: string;
  betriebsstellentypen: string[];
  primary_location_code: string;
  langname: string;
  geo_koordinaten: GeoKoordinaten;
  elektrifiziert: boolean;
  bahnhof: boolean;
}

export interface MutterBetriebsstelle {
  ds100: string;
  langname: string;
  geo_koordinaten: GeoKoordinaten;
  tochterbetriebsstellen: string[];
}

export interface Streckensegment {
  von: string;
  bis: string;
  streckennummer: number;
  von_km: number;
  bis_km: number;
}

export interface Ordnungsrahmen {
  betriebsstellen: Betriebsstelle[];
  mutter_betriebsstellen: MutterBetriebsstelle[];
  streckensegmente: Streckensegment[];
}

export interface Data {
  id: number;
  anzeigename: string;
  fahrplanjahr: number;
  gueltig_von: string;
  gueltig_bis: string;
  ordnungsrahmen: Ordnungsrahmen;
}

interface MilestoneData {
  osm_id: number;
  railway: string;
  position: number;
  longitude: number;
  latitude: number;
  ref: string;
  operator: string;
}

const dataTyped = data as Data;

// export function findStrecke(query: number): Strecke[] {
//   const seen = new Set<string>();
//   const results: Strecke[] = [];

//   const pushIfNew = (b: Streckensegment) => {
//     if (!seen.has(b.von)) {
//       seen.add(b.von);
//       results.push({
//         streckennummer: b.streckennummer,
//         betriebsstelle: dataTyped.ordnungsrahmen.betriebsstellen.find(
//           (c) => c.ds100 === b.von
//         ),
//         km: b.von_km,
//       });
//     }
//   };

//   for (const b of dataTyped.ordnungsrahmen.streckensegmente) {
//     if (b.streckennummer === query) {
//       pushIfNew(b);
//     }
//   }
//   results.sort((a, b) => a.km - b.km);

//   return results;
// }

export function findBetriebstellen(query: string): Betriebsstelle[] {
  const q = query.trim().toLowerCase();
  // if (!q) return [];

  const seen = new Set<string>();
  const results: Betriebsstelle[] = [];

  const pushIfNew = (b: Betriebsstelle) => {
    if (!seen.has(b.ds100)) {
      seen.add(b.ds100);
      results.push(b);
    }
  };

  // 1) exakte Treffer
  for (const b of dataTyped.ordnungsrahmen.betriebsstellen) {
    if (b.ds100.toLowerCase() === q || b.langname.toLowerCase() === q) {
      pushIfNew(b);
    }
  }

  // 2) beginnt mit
  for (const b of dataTyped.ordnungsrahmen.betriebsstellen) {
    if (seen.has(b.ds100)) continue;
    if (
      b.ds100.toLowerCase().startsWith(q) ||
      b.langname.toLowerCase().startsWith(q)
    ) {
      pushIfNew(b);
    }
  }

  // 3) enthält
  for (const b of dataTyped.ordnungsrahmen.betriebsstellen) {
    if (seen.has(b.ds100)) continue;
    if (
      b.ds100.toLowerCase().includes(q) ||
      b.langname.toLowerCase().includes(q)
    ) {
      pushIfNew(b);
    }
  }

  return results;
}

export function findBetriebsstelleByNumber(query: string) {
  const seen = new Set<string>();
  const vzgBst = dataTyped.ordnungsrahmen.streckensegmente
    .filter((strecke) => strecke.streckennummer === Number(query))
    .sort((a, b) => a.von_km - b.von_km)
    .map((a) => {
      if (!seen.has(a.von)) {
        seen.add(a.von);
        return a;
      }
    })
    .filter((a) => a !== undefined)
    .map((s) => {
      return dataTyped.ordnungsrahmen.betriebsstellen.find(
        (bst) => bst.ds100 === s.von
      );
    })
    .filter((b): b is Betriebsstelle => b !== undefined);
  return vzgBst;
}

export function groupSegmenteByStreckennummer(
  segments?: Streckensegment[]
): { streckennummer: number; segmente: Streckensegment[] }[] {
  const segs = segments ?? dataTyped.ordnungsrahmen.streckensegmente;
  const map = new Map<number, Streckensegment[]>();

  for (const s of segs) {
    const key = s.streckennummer;
    const arr = map.get(key);
    if (arr) arr.push(s);
    else map.set(key, [s]);
  }

  return Array.from(map.entries()).map(([streckennummer, segmente]) => ({
    streckennummer,
    segmente,
  }));
}

export function findStreckensegmente(ds100: string): {
  streckennummer: number;
  betriebsstelle?: Betriebsstelle;
  von: {
    segment?: Streckensegment;
    betriebsstelle?: Betriebsstelle;
  };
  bis: {
    segment?: Streckensegment;
    betriebsstelle?: Betriebsstelle;
  };
}[] {
  const von = dataTyped.ordnungsrahmen.streckensegmente.filter(
    (segment) =>
      (segment.von === ds100 || segment.bis === ds100) &&
      segment.von_km < segment.bis_km
  );

  return groupSegmenteByStreckennummer(von).map((line) => ({
    streckennummer: line.streckennummer,
    betriebsstelle: dataTyped.ordnungsrahmen.betriebsstellen.find(
      (bst) => bst.ds100 === ds100
    ),
    von: {
      segment: line.segmente.find((segmentLine) => segmentLine.bis === ds100),
      betriebsstelle: dataTyped.ordnungsrahmen.betriebsstellen.find(
        (bst) =>
          bst.ds100 ===
          line.segmente.find((segmentLine) => segmentLine.bis === ds100)?.von
      ),
    },
    bis: {
      segment: line.segmente.find((segmentLine) => segmentLine.von === ds100),
      betriebsstelle: dataTyped.ordnungsrahmen.betriebsstellen.find(
        (bst) =>
          bst.ds100 ===
          line.segmente.find((segmentLine) => segmentLine.von === ds100)?.bis
      ),
    },
  }));
}

export function getDataInfo(): {
  anzeigename: string;
  fahrplanjahr: number;
  gueltig_von: string;
  gueltig_bis: string;
} {
  return {
    anzeigename: dataTyped.anzeigename,
    fahrplanjahr: dataTyped.fahrplanjahr,
    gueltig_von: dataTyped.gueltig_von,
    gueltig_bis: dataTyped.gueltig_bis,
  };
}

export function findBst(searchString: string) {
  const onlyDigits = /^\d+$/;

  if (onlyDigits.test(searchString)) {
    return findBetriebsstelleByNumber(searchString);
  }
  return findBetriebstellen(searchString).slice(0, 10);
}

const convertMilestonesToBetriebsstellen = (
  milestones: MilestoneData[]
): Betriebsstelle[] => {
  return milestones.map((milestone) => ({
    x: milestone.longitude,
    y: milestone.latitude,
    ds100: `km ${milestone.position.toFixed(3).toString()}`,
    betriebsstellentypen: [],
    primary_location_code: "",
    langname: milestone.ref,
    geo_koordinaten: {
      breite: milestone.latitude,
      laenge: milestone.longitude,
    },
    elektrifiziert: false,
    bahnhof: false,
  }));
};

export async function findMilestoneFromOpenrailway(
  searchString: string,
  searchStringKm: string
): Promise<Betriebsstelle[]> {
  if (!searchString || !searchStringKm) return [];
  const data = await fetch(
    `https://api.openrailwaymap.org/v2/milestone?ref=${searchString}&position=${searchStringKm}`
  );
  const milestones: MilestoneData[] = await data.json();
  const convertedResults = convertMilestonesToBetriebsstellen(milestones);
  return convertedResults;
}

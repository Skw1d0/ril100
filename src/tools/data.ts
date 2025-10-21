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

const dataTyped = data as Data;

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

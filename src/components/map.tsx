import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Marker2Image from "../assets/marker-icon-2x.png";
import MarkerImage from "../assets/marker-icon.png";
import MarkerShadow from "../assets/marker-shadow.png";

// Fix for default marker icon in deployed environments
// delete (L.Icon.Default.prototype as any)._getIconUrl;
delete (
  L.Icon.Default.prototype as unknown as {
    _getIconUrl?: () => string;
  }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: Marker2Image,
  iconUrl: MarkerImage,
  shadowUrl: MarkerShadow,
});

export type Style =
  | "standard"
  | "signals"
  | "maxspeed"
  | "electrification"
  | "gauge";

export interface Position {
  center: [number, number];
  zoom: number;
}

interface MapProps {
  view: Position;
  style: Style;
}

function Recenter({ position }: { position: Position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position.center, position.zoom);
    }
  }, [position, map]);
  return null;
}

// new: component that invalidates size on window resize (debounced)
function ResizeHandler({ trigger }: { trigger?: string }) {
  const map = useMap();

  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => map.invalidateSize(), 150);
    };
    window.addEventListener("resize", onResize);
    // initial invalidate
    map.invalidateSize();
    return () => {
      window.removeEventListener("resize", onResize);
      if (t) window.clearTimeout(t);
    };
  }, [map, trigger]);
  return null;
}

function TrackCenter({ onChange }: { onChange: (position: Position) => void }) {
  const map = useMapEvents({
    move: () => {
      const c = map.getCenter();
      const z = map.getZoom();
      onChange({ center: [c.lat, c.lng], zoom: z });
    },
  });

  return null;
}

function Map({ view, style }: MapProps) {
  const [position, setPosition] = useState<Position>(view);

  useEffect(() => {
    setPosition(view);
  }, [view]);

  return (
    <MapContainer
      center={position.center}
      zoom={position.zoom}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='Kartendaten von <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <TileLayer
        attribution='<a href="https://www.openrailwaymap.org/imprint-de.html">OpenRailwayMaps</a>'
        url={`https://tiles.openrailwaymap.org/${style}/{z}/{x}/{y}.png`}
      />
      {/* <Recenter
        position={
          view?.center
            ? [view.center[0], view.center[1]]
            : [49.18904838625939, 10.105822664241146]
        }
      /> */}
      <Marker position={[view.center[0], view.center[1]]} />
      <ResizeHandler trigger={view?.center?.join(",")} />
      <Recenter position={position} />
      <TrackCenter onChange={setPosition} />
    </MapContainer>
  );
}

export default Map;

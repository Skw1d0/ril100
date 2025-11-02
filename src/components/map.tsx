import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

interface MapProps {
  mapView: {
    center: [number, number];
    zoom: number;
  } | null;
}

function Recenter({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 17);
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

function Map({ mapView }: MapProps) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={17}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='Kartendaten von <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <TileLayer
        attribution='<a href="https://www.openrailwaymap.org/imprint-de.html">OpenRailwayMaps</a>'
        url="https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
      />
      <Recenter
        position={
          mapView?.center
            ? [mapView.center[0], mapView.center[1]]
            : [49.18904838625939, 10.105822664241146]
        }
      />
      <ResizeHandler trigger={mapView?.center?.join(",")} />
    </MapContainer>
  );
}

export default Map;

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BOUNDS } from "../data/constants";
import { C } from "../theme";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const rectBounds = [
  [BOUNDS.latMin, BOUNDS.lonMin],
  [BOUNDS.latMax, BOUNDS.lonMax],
];

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      const lat = Math.min(
        Math.max(e.latlng.lat, BOUNDS.latMin),
        BOUNDS.latMax
      );

      const lon = Math.min(
        Math.max(e.latlng.lng, BOUNDS.lonMin),
        BOUNDS.lonMax
      );

      onPick(
        Math.round(lat * 100) / 100,
        Math.round(lon * 100) / 100
      );
    },
  });

  return null;
}

function RecenterOnPick({ lat, lon }) {
  const map = useMap();

  useEffect(() => {
    map.panTo([lat, lon], {
      animate: true,
      duration: 0.5,
    });
  }, [lat, lon, map]);

  return null;
}

function FullscreenButton() {
  const map = useMap();

  const toggleFullscreen = () => {
    const mapContainer = map.getContainer();

    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      title="Fullscreen"
      type="button"
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        width: 34,
        height: 34,
        borderRadius: 6,
        border: `1px solid ${C.border}`,
        background: C.bgCard,
        color: C.text,
        cursor: "pointer",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ⛶
    </button>
  );
}

export default function LocationPicker({ lat, lon, onPick }) {
  const center = [
    (BOUNDS.latMin + BOUNDS.latMax) / 2,
    (BOUNDS.lonMin + BOUNDS.lonMax) / 2,
  ];

  const [latInput, setLatInput] = useState(String(lat));
  const [lonInput, setLonInput] = useState(String(lon));
  const [coordError, setCoordError] = useState("");

  useEffect(() => {
    setLatInput(String(lat));
    setLonInput(String(lon));
  }, [lat, lon]);

  const handleManualSubmit = (e) => {
    e.preventDefault();

    const parsedLat = parseFloat(latInput);
    const parsedLon = parseFloat(lonInput);

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
      setCoordError("Enter valid numbers for both fields.");
      return;
    }

    if (
      parsedLat < BOUNDS.latMin ||
      parsedLat > BOUNDS.latMax ||
      parsedLon < BOUNDS.lonMin ||
      parsedLon > BOUNDS.lonMax
    ) {
      setCoordError(
        `Out of range. Lat ${BOUNDS.latMin}–${BOUNDS.latMax}, Lon ${BOUNDS.lonMin}–${BOUNDS.lonMax}.`
      );
      return;
    }

    const newLat = Math.round(parsedLat * 100) / 100;
    const newLon = Math.round(parsedLon * 100) / 100;

    setCoordError("");

    // Update marker + map position
    onPick(newLat, newLon);
  };

  return (
    <div>
      {/* MAP */}
      <div
        style={{
          position: "relative",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #1C3A52",
          isolation: "isolate",
        }}
      >
        <MapContainer
          center={center}
          zoom={6}
          minZoom={5}
          maxZoom={9}
          maxBounds={rectBounds}
          maxBoundsViscosity={1.0}
          style={{ height: 260, width: "100%" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FullscreenButton />

          <Rectangle
            bounds={rectBounds}
            pathOptions={{
              color: "#3FA9A0",
              weight: 1,
              fillOpacity: 0.04,
            }}
          />

          {/* POINTER / MARKER */}
          <Marker position={[lat, lon]} />

          <ClickHandler onPick={onPick} />

          {/* MOVE MAP WHEN COORDINATES CHANGE */}
          <RecenterOnPick lat={lat} lon={lon} />
        </MapContainer>
      </div>

      {/* QUICK LOCATION BUTTONS */}
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => onPick(12.2, 81.5)}
          className="oe-pill text-xs px-3 py-1.5 rounded-full"
          style={{
            background: C.bgCard,
            color: C.text,
            border: `1px solid ${C.border}`,
          }}
        >
          Near coast
        </button>

        <button
          type="button"
          onClick={() => onPick(13.4, 84.2)}
          className="oe-pill text-xs px-3 py-1.5 rounded-full"
          style={{
            background: C.bgCard,
            color: C.text,
            border: `1px solid ${C.border}`,
          }}
        >
          Open ocean
        </button>
      </div>

      {/* MANUAL COORDINATES */}
      <form onSubmit={handleManualSubmit} className="mt-3">
        <div
          className="text-[11px] mb-1.5"
          style={{ color: C.dim }}
        >
          Or enter coordinates manually
        </div>

        <div className="flex gap-2 items-start">
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder="Lat"
            value={latInput}
            onChange={(e) => {
              setLatInput(e.target.value);
              setCoordError("");
            }}
            className="text-xs px-2.5 py-1.5 rounded-lg flex-1 min-w-0"
            style={{
              background: C.bgCard,
              color: C.text,
              border: `1px solid ${C.border}`,
            }}
            aria-label="Latitude"
          />

          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder="Lon"
            value={lonInput}
            onChange={(e) => {
              setLonInput(e.target.value);
              setCoordError("");
            }}
            className="text-xs px-2.5 py-1.5 rounded-lg flex-1 min-w-0"
            style={{
              background: C.bgCard,
              color: C.text,
              border: `1px solid ${C.border}`,
            }}
            aria-label="Longitude"
          />

          {/* APPLY BUTTON */}
          <button
            type="submit"
            className="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{
              background: C.teal,
              color: C.bgDeep,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Apply
          </button>
        </div>

        {coordError && (
          <div
            className="text-[11px] mt-1.5"
            style={{ color: C.coral }}
          >
            {coordError}
          </div>
        )}
      </form>
    </div>
  );
}
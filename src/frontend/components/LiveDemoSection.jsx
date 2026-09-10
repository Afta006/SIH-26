import { useState } from "react";
import { MapPin } from "lucide-react";
import { C } from "../theme";
import { DATE_MIN, DATE_MAX } from "../data/constants";
import { fetchProfile } from "../api/predictions";
import DepthChart from "./DepthChart";
import LocationPicker from "./LocationPicker";
import Skeleton from "./Skeleton";

export default function LiveDemoSection() {
  const [lat, setLat] = useState(12.5);
  const [lon, setLon] = useState(82.5);
  const [date, setDate] = useState("2023-02-15");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("Pick a point on the map, then reconstruct.");
  const [loading, setLoading] = useState(false);

  const handleReconstruct = async () => {
    setLoading(true);
    setStatus("Reconstructing profile…");
    try {
      const profile = await fetchProfile(lat, lon, date);
      setResult(profile);
      setStatus(`Reconstructed profile for ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E on ${date}.`);
    } catch (err) {
      setResult(null);
      setStatus(err.message || "Prediction failed — try a different point or date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="live-demo" className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
     <div className="flex items-center gap-3 mb-6">
  <div
    style={{
      width: "32px",
      height: "1px",
      background: C.teal,
    }}
  />

  <div
    className="text-[11px] uppercase tracking-[0.25em]"
    style={{ color: C.teal }}
  >
    Live Demo
  </div>
</div>
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-6">
        <div className="rounded-xl p-5" style={{ background: C.bgPanel, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} color={C.amber} />
            <span className="text-xs" style={{ color: C.dim, fontFamily: "'IBM Plex Mono', monospace" }}>
              {lat.toFixed(2)}°N, {lon.toFixed(2)}°E
            </span>
          </div>
          <LocationPicker
            lat={lat}
            lon={lon}
            onPick={(la, lo) => {
              setLat(la);
              setLon(lo);
              setResult(null);
              setStatus(`Selected ${la.toFixed(2)}°N, ${lo.toFixed(2)}°E.`);
            }}
          />
          <div className="mt-4 flex flex-col gap-1">
            <label className="text-xs" style={{ color: C.dim }}>Date</label>
            <input
              type="date"
              value={date}
              min={DATE_MIN}
              max={DATE_MAX}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg"
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'IBM Plex Mono', monospace" }}
            />
          </div>
          <button
            onClick={handleReconstruct}
            disabled={loading}
            className="oe-cta mt-4 w-full px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
            style={{ background: C.teal, color: C.bgDeep }}
          >
            {loading ? "Reconstructing…" : "Reconstruct"}
          </button>
          <p className="text-xs mt-3" style={{ color: C.dim }}>{status}</p>
        </div>
        <div className="rounded-xl p-5" style={{ background: C.bgPanel, border: `1px solid ${C.border}` }}>
          {loading ? (
            <Skeleton block height={300} />
          ) : result ? (
            <>
              <DepthChart series={[
                { name: "Predicted", color: C.teal, data: result.predicted.map((v, i) => ({ depth: result.depths[i], value: v })) },
                { name: "GLORYS (actual)", color: C.coral, data: result.actual.map((v, i) => ({ depth: result.depths[i], value: v })) },
              ]} />
              <div className="flex gap-4 mt-2 text-xs" style={{ color: C.dim }}>
                <span className="flex items-center gap-1.5">
                  <i style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal, display: "inline-block" }} />Predicted
                </span>
                <span className="flex items-center gap-1.5">
                  <i style={{ width: 8, height: 8, borderRadius: "50%", background: C.coral, display: "inline-block" }} />GLORYS (actual)
                </span>
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-center text-sm px-6" style={{ color: C.dim }}>
              Pick a point and date, then reconstruct to see the depth profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
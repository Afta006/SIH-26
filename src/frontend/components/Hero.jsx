import { Satellite } from "lucide-react";
import { C } from "../theme";
import { SAMPLE_HERO } from "../data/constants";
import DepthChart from "./DepthChart";

export default function Hero({ scrollTo }) {
  return (
    <div className="grid md:grid-cols-2 gap-10 px-6 md:px-12 py-16 max-w-6xl mx-auto items-center">
      <div>
        <div
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest px-3 py-1 rounded-full mb-6"
          style={{ background: C.tealSoft, color: C.teal }}
        >
                Satellite Embedding · Deep Learning
        </div>
        <h1 className="oe-display text-4xl md:text-5xl leading-tight mb-5">
          Reconstructing the ocean<br />you can't see from space.
        </h1>
        <p className="text-base leading-relaxed mb-6 max-w-lg" style={{ color: C.dim }}>
          Satellites see the surface. ARGO floats sample a sparse handful of points below it. OceanEmbed
          learns the link between the two, reconstructing full temperature profiles down to 1000&nbsp;m.
        </p>
        <button
          onClick={() => scrollTo("live-demo")}
          className="oe-cta px-6 py-3 rounded-full text-sm font-semibold"
          style={{ background: C.teal, color: C.bgDeep }}
        >
          Try the live demo
        </button>
      </div>
      <div className="rounded-xl p-5" style={{ background: C.bgPanel, border: `1px solid ${C.border}` }}>
        <DepthChart series={[{ name: "Sample", color: C.teal, data: SAMPLE_HERO }]} />
        <div className="text-center text-[11px] mt-1" style={{ color: C.dim }}>Illustrative sample profile</div>
      </div>
    </div>
  );
}

import { C } from "../theme";

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="px-6 md:px-12 py-20 max-w-6xl mx-auto"
    >
      {/* Section Label */}
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
          The Problem
        </div>
      </div>

      {/* Main Heading */}
      <div className="max-w-4xl mb-12">
        <h2
          className="text-3xl md:text-5xl leading-tight font-semibold mb-6"
          style={{ color: C.text }}
        >
          We can see the ocean surface.
          <br />
          <span style={{ color: C.teal }}>
            But what lies beneath? 
          </span>
        </h2>

        <p
          className="text-sm md:text-base leading-7 max-w-3xl"
          style={{ color: C.dim }}
        >
          Satellites continuously observe the ocean surface at basin scale
          measuring sea-surface temperature, salinity, height, currents and
          winds. But the temperature that drives circulation, marine heatwaves
          and fisheries exists below the surface, where direct observations
          remain sparse.
        </p>
      </div>

      {/* Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

        {/* Card 1 */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest mb-4"
            style={{ color: C.teal }}
          >
            01 · Surface
          </div>

          <h3
            className="text-xl font-semibold mb-3"
            style={{ color: C.text }}
          >
            Rich satellite data
          </h3>

          <p
            className="text-sm leading-6"
            style={{ color: C.dim }}
          >
            Satellites provide continuous, large-scale observations of the
            ocean surface and its surrounding atmospheric conditions.
          </p>
        </div>

        {/* Card 2 */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest mb-4"
            style={{ color: C.teal }}
          >
            02 · The Gap
          </div>

          <h3
            className="text-xl font-semibold mb-3"
            style={{ color: C.text }}
          >
            Sparse subsurface data
          </h3>

          <p
            className="text-sm leading-6"
            style={{ color: C.dim }}
          >
            Below the surface, observations are limited to sparse ARGO floats
            and ship-based measurements, leaving large regions unobserved.
          </p>
        </div>

        {/* Card 3 */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest mb-4"
            style={{ color: C.teal }}
          >
            03 · Our Approach
          </div>

          <h3
            className="text-xl font-semibold mb-3"
            style={{ color: C.text }}
          >
            Reconstruct the depth
          </h3>

          <p
            className="text-sm leading-6"
            style={{ color: C.dim }}
          >
            OceanEmbed maps the observed surface state into a complete
            subsurface temperature profile using learned embeddings.
          </p>
        </div>
      </div>

      {/* Surface → Embedding → Depth */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: C.tealSoft,
          border: `1px solid ${C.border}`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Surface */}
          <div>
            <div
              className="text-[10px] uppercase tracking-widest mb-2"
              style={{ color: C.dim }}
            >
              What we observe
            </div>

            <div
              className="text-lg font-semibold"
              style={{ color: C.text }}
            >
              Surface state
            </div>

            <div
              className="text-xs mt-2"
              style={{ color: C.dim }}
            >
              SST · Salinity · Height · Winds
            </div>
          </div>

          {/* Arrow */}
<div
  className="hidden md:flex items-center justify-center"
  style={{ color: C.teal }}
>
  <div
    style={{
      flex: 1,
      height: "1px",
      background: C.teal,
    }}
  />

  <span
    className="text-[10px] uppercase tracking-widest"
    style={{
      color: C.teal,
      margin: "0 14px",
      whiteSpace: "nowrap",
    }}
  >
    Embed
  </span>

  <div
    style={{
      flex: 1,
      height: "1px",
      background: C.teal,
    }}
  />

  <div
    style={{
      width: 0,
      height: 0,
      borderTop: "4px solid transparent",
      borderBottom: "4px solid transparent",
      borderLeft: `6px solid ${C.teal}`,
    }}
  />
</div>

          {/* Depth */}
          <div className="md:text-right">
            <div
              className="text-[10px] uppercase tracking-widest mb-2"
              style={{ color: C.dim }}
            >
              What we reconstruct
            </div>

            <div
              className="text-lg font-semibold"
              style={{ color: C.text }}
            >
              Full depth profile
            </div>

            <div
              className="text-xs mt-2"
              style={{ color: C.dim }}
            >
              Surface → Subsurface temperature
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Statement */}
<div className="mt-10 text-center px-4">
  <p
    className="text-base md:text-lg leading-8 max-w-4xl mx-auto"
    style={{
      color: C.dim,
      textAlign: "center",
    }}
  >
    Trained against{" "}
    <span style={{ color: C.text, fontWeight: 600 }}>GLORYS</span>{" "}
    and validated against{" "}
    <span style={{ color: C.text, fontWeight: 600 }}>
      independent ARGO observations.
    </span>
  </p>
</div>
    </section>
  );
}
export const STANDARD_DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
export const BOUNDS = { latMin: 10, latMax: 15, lonMin: 80, lonMax: 85 };
export const DATE_MIN = "2023-01-01";
export const DATE_MAX = "2023-04-30";

export const NAV_LINKS = [
  { id: "problem", label: "The Problem" },
  { id: "pipeline", label: "Pipeline" },
  { id: "results", label: "Results" },
  { id: "live-demo", label: "Live Demo" },
];

export const PIPELINE = [
  {
    n: "01", title: "Acquire", icon: "Satellite",
    desc: "Pull daily SST, SSS, SSH, currents and winds from satellite sources.",
    details: [
      "Surface variables are salinity, sea surface height, ocean currents (U,V) that was pulled from CMEMS (GLORYS12 reanalysis)",
      "Surface winds (U,V) pulled separately from ERA5 via the Copernicus Climate Data Store",
      "Covers the Bay of Bengal PoC region: 10–15°N, 80–85°E",
      "Daily resolution, January–April 2023 (120 days)",
    ],
  },
  {
    n: "02", title: "Harmonize", icon: "Layers",
    desc: "Align multi-source grids to a common 0.25° spatial, daily temporal reference.",
    details: [
      "CMEMS and ERA5 arrive on different grids and coordinate conventions, merging them naively would misalign every point",
      "ERA5's hourly wind is resampled to a daily mean to match CMEMS's daily cadence",
      "ERA5 is then interpolated onto CMEMS's exact latitude/longitude grid, so every variable shares one common grid and timestamp",
      "Result: one unified 6-channel surface dataset (salinity, height, 2 current components, 2 wind components) per day",
    ],
  },
  {
    n: "03", title: "Standardize Depth", icon: "Ruler",
    desc: "Resample ARGO and GLORYS targets onto 15 standard depth levels.",
    details: [
      "GLORYS provides 36 irregular native depth levels (0.49m–1062m), not the exact depths the problem statement specifies",
      "Interpolated onto the 15 required standard levels: 0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000m",
      "Remaining gaps at deeper levels reflect real ocean bathymetry (shallow coastal seafloor), not missing data or a bug",
    ],
  },
  {
    n: "04", title: "Reconstruct", icon: "Cpu",
    desc: "A CNN maps the surface embedding to a full 0–1000m temperature profile.",
    details: [
      "Two models built and compared: a per-pixel Random Forest baseline, and a spatial CNN, the \"embedding\" style architecture",
      "CNN takes a 15×15 surface patch (not just one point) as input, letting it use nearby spatial context, not just an isolated pixel",
      "Patch-based training turned 96 daily snapshots into 260,000+ individual training examples",
      "Final CNN (with batch normalization + learning-rate scheduling) reaches ~0.40°C RMSE, beating the Random Forest baseline's 0.60°C",
    ],
  },
  {
    n: "05", title: "Validate", icon: "CheckCircle2",
    desc: "Score against independent ARGO profiles using RMSE, correlation and bias.",
    details: [
      "Checked against 33 real ARGO float profiles, downloaded directly from Ifremer's Global Data Assembly Centre",
      "These are genuine physical ocean measurements the model never trained on a true independent test",
      "RMSE ranges 0.13–1.44°C depending on depth",
      "Error consistently peaks in the thermocline (75–150m) across every evaluation, the hardest layer to predict, and the same pattern showing up independently each time is strong evidence the model learned real ocean physics",
    ],
  },
];

export const SAMPLE_HERO = [
  { depth: 0, value: 28.2 }, { depth: 20, value: 27.8 }, { depth: 50, value: 24.1 },
  { depth: 75, value: 19.5 }, { depth: 100, value: 16.2 }, { depth: 150, value: 13.1 },
  { depth: 200, value: 11.0 }, { depth: 300, value: 8.6 }, { depth: 500, value: 6.4 },
  { depth: 700, value: 5.3 }, { depth: 1000, value: 4.6 },
];
/**
 * Talks to the Express + MongoDB backend built for OceanEmbed.
 * Matches the exact response shapes documented in the backend README:
 *   GET /api/meta
 *   GET /api/predict?date=YYYY-MM-DD&lat=..&lon=..
 *   GET /api/results
 *
 * During development (before the backend is deployed), set VITE_API_BASE_URL
 * in a .env file, e.g. VITE_API_BASE_URL=http://localhost:5000
 * Leave it unset to call the same origin the frontend is served from.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function fetchMeta() {
  const res = await fetch(`${BASE_URL}/api/meta`);
  return handleResponse(res);
}

export async function fetchProfile(lat, lon, dateStr) {
  const url = `${BASE_URL}/api/predict?date=${dateStr}&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  const data = await handleResponse(res);

  // Reshape the backend's flat arrays into the {depths, predicted, actual}
  // shape the chart components expect.
  return {
    depths: data.depths,
    predicted: data.predicted_temp,
    actual: data.actual_temp,
  };
}

export async function fetchResults() {
  const res = await fetch(`${BASE_URL}/api/results`);
  const data = await handleResponse(res);

  // Reshape to match what ResultsSection expects
  return {
    rf_rmse: data.rf_rmse_overall,
    cnn_rmse: data.cnn_rmse_overall,
    argo_profiles_used: data.argo_profiles_used,
    rmse_by_depth: data.argo_validation.depths.map((depth, i) => ({
      depth,
      rmse: data.argo_validation.rmse[i],
    })),
  };
}

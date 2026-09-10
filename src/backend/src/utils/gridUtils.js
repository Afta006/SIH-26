import { env } from '../config/env.js'

/**
 * Snap an arbitrary lat/lon to the nearest cell center of the standard
 * output grid (default 0.25 degree resolution).
 */
export function snapToGrid(lat, lon, resolution = env.gridResolutionDeg) {
  const snap = (v) => Math.round(v / resolution) * resolution
  return {
    lat: Number(snap(lat).toFixed(4)),
    lon: Number(snap(lon).toFixed(4)),
  }
}

/**
 * Generate all grid cell centers within a bounding box at the given resolution.
 * Used when materializing/mocking a reconstruction output grid.
 */
export function generateGridPoints(bbox, resolution = env.gridResolutionDeg) {
  const points = []
  for (let lat = bbox.latMin; lat <= bbox.latMax; lat += resolution) {
    for (let lon = bbox.lonMin; lon <= bbox.lonMax; lon += resolution) {
      points.push({ lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)) })
    }
  }
  return points
}

/**
 * Great-circle distance in kilometers (Haversine) — used to match ARGO
 * float observations to the nearest reconstruction grid cell.
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function isWithinRegion(lat, lon, region) {
  return (
    lat >= region.latMin && lat <= region.latMax && lon >= region.lonMin && lon <= region.lonMax
  )
}

/** Standard depth levels (meters) used for subsurface reconstruction, matching ARGO. */
export const STANDARD_DEPTH_LEVELS = [0, 10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 700, 1000]

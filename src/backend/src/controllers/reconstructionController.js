import asyncHandler from 'express-async-handler'
import Reconstruction from '../models/Reconstruction.js'
import { ok, ApiError } from '../utils/apiResponse.js'
import { snapToGrid } from '../utils/gridUtils.js'

/**
 * Returns the full reconstructed grid for a given date (+ optional bbox),
 * shaped for direct consumption by a react-leaflet heatmap/choropleth layer.
 */
export const getGridByDate = asyncHandler(async (req, res) => {
  const { date, modelVersion = 'reconstruction-v1', depth, latMin, latMax, lonMin, lonMax } = req.query
  if (!date) throw new ApiError(400, 'Query param "date" is required (YYYY-MM-DD).')

  const filter = { date: new Date(date), modelVersion }
  if (latMin) filter.lat = { $gte: Number(latMin) }
  if (latMax) filter.lat = { ...(filter.lat || {}), $lte: Number(latMax) }
  if (lonMin) filter.lon = { $gte: Number(lonMin) }
  if (lonMax) filter.lon = { ...(filter.lon || {}), $lte: Number(lonMax) }

  const docs = await Reconstruction.find(filter).lean()

  const points = docs.map((d) => {
    if (depth !== undefined) {
      const level = d.profile.find((p) => Math.abs(p.depth - Number(depth)) < 1e-6)
      return { lat: d.lat, lon: d.lon, temperature: level?.temperature ?? null, depth: Number(depth) }
    }
    return { lat: d.lat, lon: d.lon, profile: d.profile }
  })

  ok(res, { date, modelVersion, count: points.length, points })
})

/**
 * Returns the reconstructed subsurface temperature time series at a single
 * point (nearest grid cell), useful for a "click a location, see the trend" UI.
 */
export const getTimeSeriesAtPoint = asyncHandler(async (req, res) => {
  const { lat, lon, start, end, depth, modelVersion = 'reconstruction-v1' } = req.query
  if (lat === undefined || lon === undefined || !start || !end) {
    throw new ApiError(400, 'Query params "lat", "lon", "start", "end" are required.')
  }

  const snapped = snapToGrid(Number(lat), Number(lon))

  const docs = await Reconstruction.find({
    lat: snapped.lat,
    lon: snapped.lon,
    modelVersion,
    date: { $gte: new Date(start), $lte: new Date(end) },
  })
    .sort({ date: 1 })
    .lean()

  const series = docs.map((d) => {
    if (depth !== undefined) {
      const level = d.profile.find((p) => Math.abs(p.depth - Number(depth)) < 1e-6)
      return { date: d.date, temperature: level?.temperature ?? null }
    }
    return { date: d.date, profile: d.profile }
  })

  ok(res, { lat: snapped.lat, lon: snapped.lon, modelVersion, series })
})

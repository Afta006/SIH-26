import asyncHandler from 'express-async-handler'
import ArgoObservation from '../models/ArgoObservation.js'
import { ok, created, ApiError } from '../utils/apiResponse.js'

export const createArgoObservation = asyncHandler(async (req, res) => {
  const { floatId, cycleNumber, date, lat, lon, profile } = req.body
  const obs = await ArgoObservation.create({
    floatId,
    cycleNumber,
    date,
    lat,
    lon,
    profile,
    importedBy: req.user._id,
  })
  created(res, { observation: obs })
})

/** Bulk import many ARGO profiles at once (e.g. parsed from an ARGO NetCDF/CSV export). */
export const bulkImportArgo = asyncHandler(async (req, res) => {
  const { observations } = req.body
  if (!Array.isArray(observations) || observations.length === 0) {
    throw new ApiError(400, '"observations" must be a non-empty array.')
  }

  const docs = observations.map((o) => ({ ...o, importedBy: req.user._id }))
  const result = await ArgoObservation.insertMany(docs, { ordered: false })
  created(res, { insertedCount: result.length })
})

export const listArgoObservations = asyncHandler(async (req, res) => {
  const { start, end, latMin, latMax, lonMin, lonMax, floatId, page = 1, limit = 50 } = req.query

  const filter = {}
  if (start || end) {
    filter.date = {}
    if (start) filter.date.$gte = new Date(start)
    if (end) filter.date.$lte = new Date(end)
  }
  if (latMin) filter.lat = { $gte: Number(latMin) }
  if (latMax) filter.lat = { ...(filter.lat || {}), $lte: Number(latMax) }
  if (lonMin) filter.lon = { $gte: Number(lonMin) }
  if (lonMax) filter.lon = { ...(filter.lon || {}), $lte: Number(lonMax) }
  if (floatId) filter.floatId = floatId

  const skip = (Number(page) - 1) * Number(limit)
  const [observations, total] = await Promise.all([
    ArgoObservation.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
    ArgoObservation.countDocuments(filter),
  ])

  ok(res, { observations }, { total, page: Number(page), limit: Number(limit) })
})

export const deleteArgoObservation = asyncHandler(async (req, res) => {
  const obs = await ArgoObservation.findByIdAndDelete(req.params.id)
  if (!obs) throw new ApiError(404, 'Observation not found.')
  ok(res, { deleted: true })
})

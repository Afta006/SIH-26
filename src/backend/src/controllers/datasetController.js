import asyncHandler from 'express-async-handler'
import Dataset from '../models/Dataset.js'
import { ok, created, ApiError } from '../utils/apiResponse.js'

export const createDataset = asyncHandler(async (req, res) => {
  const { name, source, variable, region, dateRange, spatialResolutionDeg, temporalResolution } =
    req.body

  const dataset = await Dataset.create({
    name,
    source,
    variable,
    region,
    dateRange,
    spatialResolutionDeg,
    temporalResolution,
    filePath: req.file ? req.file.path : undefined,
    uploadedBy: req.user._id,
  })

  created(res, { dataset })
})

export const listDatasets = asyncHandler(async (req, res) => {
  const { source, variable, status, page = 1, limit = 20 } = req.query

  const filter = {}
  if (source) filter.source = source
  if (variable) filter.variable = variable
  if (status) filter.status = status

  const skip = (Number(page) - 1) * Number(limit)
  const [datasets, total] = await Promise.all([
    Dataset.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Dataset.countDocuments(filter),
  ])

  ok(res, { datasets }, { total, page: Number(page), limit: Number(limit) })
})

export const getDataset = asyncHandler(async (req, res) => {
  const dataset = await Dataset.findById(req.params.id)
  if (!dataset) throw new ApiError(404, 'Dataset not found.')
  ok(res, { dataset })
})

export const updateDatasetStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const dataset = await Dataset.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!dataset) throw new ApiError(404, 'Dataset not found.')
  ok(res, { dataset })
})

export const deleteDataset = asyncHandler(async (req, res) => {
  const dataset = await Dataset.findByIdAndDelete(req.params.id)
  if (!dataset) throw new ApiError(404, 'Dataset not found.')
  ok(res, { deleted: true })
})

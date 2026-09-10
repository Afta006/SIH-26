import asyncHandler from 'express-async-handler'
import ValidationResult from '../models/ValidationResult.js'
import { ok, ApiError } from '../utils/apiResponse.js'

export const listValidationResults = asyncHandler(async (req, res) => {
  const { modelVersion, page = 1, limit = 20 } = req.query
  const filter = {}
  if (modelVersion) filter.modelVersion = modelVersion

  const skip = (Number(page) - 1) * Number(limit)
  const [results, total] = await Promise.all([
    ValidationResult.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ValidationResult.countDocuments(filter),
  ])
  ok(res, { results }, { total, page: Number(page), limit: Number(limit) })
})

export const getValidationResult = asyncHandler(async (req, res) => {
  const result = await ValidationResult.findById(req.params.id)
  if (!result) throw new ApiError(404, 'Validation result not found.')
  ok(res, { result })
})

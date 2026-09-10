import asyncHandler from 'express-async-handler'
import Job from '../models/Job.js'
import Dataset from '../models/Dataset.js'
import EmbeddingRecord from '../models/EmbeddingRecord.js'
import Reconstruction from '../models/Reconstruction.js'
import ValidationResult from '../models/ValidationResult.js'
import { ok, created, ApiError } from '../utils/apiResponse.js'
import { generateGridPoints } from '../utils/gridUtils.js'
import { generateEmbeddings, generateReconstruction } from '../services/mlService.js'
import { runValidation } from '../services/argoValidationService.js'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

export const listJobs = asyncHandler(async (req, res) => {
  const { type, status, page = 1, limit = 20 } = req.query
  const filter = {}
  if (type) filter.type = type
  if (status) filter.status = status

  const skip = (Number(page) - 1) * Number(limit)
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Job.countDocuments(filter),
  ])
  ok(res, { jobs }, { total, page: Number(page), limit: Number(limit) })
})

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
  if (!job) throw new ApiError(404, 'Job not found.')
  ok(res, { job })
})

/**
 * Kicks off a preprocessing job for a dataset: marks it preprocessing -> preprocessed.
 * Real cleaning/regridding logic lives in your Python pipeline; this endpoint
 * tracks the job lifecycle and hands off dataset status.
 */
export const startPreprocessing = asyncHandler(async (req, res) => {
  const { datasetId } = req.body
  const dataset = await Dataset.findById(datasetId)
  if (!dataset) throw new ApiError(404, 'Dataset not found.')

  const job = await Job.create({
    type: 'preprocessing',
    status: 'running',
    dataset: dataset._id,
    params: { spatialResolutionDeg: dataset.spatialResolutionDeg },
    startedAt: new Date(),
    createdBy: req.user._id,
  })

  dataset.status = 'preprocessing'
  await dataset.save()

  // In production this would enqueue a worker/python job. Marked completed synchronously here
  // as a placeholder; wire this to your actual pipeline (queue, webhook callback, etc).
  dataset.status = 'preprocessed'
  await dataset.save()
  job.status = 'completed'
  job.finishedAt = new Date()
  job.result = { message: 'Dataset marked preprocessed. Replace with real pipeline hook.' }
  await job.save()

  created(res, { job })
})

/**
 * Generates satellite embeddings for a date + region at the standard grid
 * resolution, calling the ML microservice (or its mock fallback).
 */
export const runEmbedding = asyncHandler(async (req, res) => {
  const { date, region = env.defaultRegion, resolutionDeg = env.gridResolutionDeg } = req.body

  const job = await Job.create({
    type: 'embedding',
    status: 'running',
    params: { date, region, resolutionDeg },
    startedAt: new Date(),
    createdBy: req.user._id,
  })

  try {
    const points = generateGridPoints(region, resolutionDeg)
    const { modelVersion, embeddings, isMock } = await generateEmbeddings({ date, points })

    const ops = embeddings.map((e) => ({
      updateOne: {
        filter: { date: new Date(date), lat: e.lat, lon: e.lon, modelVersion },
        update: { $set: { vector: e.vector, job: job._id, sourceDatasets: [] } },
        upsert: true,
      },
    }))
    if (ops.length) await EmbeddingRecord.bulkWrite(ops)

    job.status = 'completed'
    job.finishedAt = new Date()
    job.result = { modelVersion, count: embeddings.length, isMock }
    await job.save()

    created(res, { job })
  } catch (err) {
    job.status = 'failed'
    job.error = err.message
    job.finishedAt = new Date()
    await job.save()
    logger.error('embedding job failed', err)
    throw new ApiError(502, `Embedding generation failed: ${err.message}`)
  }
})

/**
 * Runs the deep-learning reconstruction model over a date + region, producing
 * subsurface temperature profiles at the standard depth levels, and stores them.
 */
export const runReconstruction = asyncHandler(async (req, res) => {
  const { date, region = env.defaultRegion, resolutionDeg = env.gridResolutionDeg } = req.body

  const job = await Job.create({
    type: 'reconstruction',
    status: 'running',
    params: { date, region, resolutionDeg },
    startedAt: new Date(),
    createdBy: req.user._id,
  })

  try {
    const points = generateGridPoints(region, resolutionDeg)
    const embeddingDocs = await EmbeddingRecord.find({ date: new Date(date) }).lean()

    const { modelVersion, results, isMock } = await generateReconstruction({
      date,
      points,
      embeddings: embeddingDocs,
    })

    const ops = results.map((r) => ({
      updateOne: {
        filter: { date: new Date(date), lat: r.lat, lon: r.lon, modelVersion },
        update: { $set: { resolutionDeg, profile: r.profile, job: job._id, isMock } },
        upsert: true,
      },
    }))
    if (ops.length) await Reconstruction.bulkWrite(ops)

    job.status = 'completed'
    job.finishedAt = new Date()
    job.result = { modelVersion, count: results.length, isMock }
    await job.save()

    created(res, { job })
  } catch (err) {
    job.status = 'failed'
    job.error = err.message
    job.finishedAt = new Date()
    await job.save()
    logger.error('reconstruction job failed', err)
    throw new ApiError(502, `Reconstruction failed: ${err.message}`)
  }
})

/**
 * Validates a model version's reconstructions against independent ARGO
 * observations over a date range + region, storing the resulting metrics.
 */
export const runValidationJob = asyncHandler(async (req, res) => {
  const { modelVersion, start, end, region, matchToleranceKm = 25 } = req.body

  const job = await Job.create({
    type: 'validation',
    status: 'running',
    params: { modelVersion, start, end, region, matchToleranceKm },
    startedAt: new Date(),
    createdBy: req.user._id,
  })

  try {
    const { overall, perDepth } = await runValidation({
      modelVersion,
      start,
      end,
      region,
      matchToleranceKm,
    })

    const validationResult = await ValidationResult.create({
      modelVersion,
      dateRange: { start, end },
      region,
      matchToleranceKm,
      overall,
      perDepth,
      job: job._id,
      createdBy: req.user._id,
    })

    job.status = 'completed'
    job.finishedAt = new Date()
    job.result = { validationResultId: validationResult._id, overall }
    await job.save()

    created(res, { job, validationResult })
  } catch (err) {
    job.status = 'failed'
    job.error = err.message
    job.finishedAt = new Date()
    await job.save()
    logger.error('validation job failed', err)
    throw new ApiError(502, `Validation failed: ${err.message}`)
  }
})

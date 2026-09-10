import axios from 'axios'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'
import { STANDARD_DEPTH_LEVELS } from '../utils/gridUtils.js'

const client = axios.create({ baseURL: env.mlService.url, timeout: env.mlService.timeoutMs })

/**
 * This module is the single integration point between the Node backend and
 * your Python satellite-embedding / deep-learning reconstruction model.
 * Expected Python service contract (e.g. served with FastAPI):
 *
 *   POST /embed
 *     body: { date, points: [{lat, lon}], surfaceObservations: {...} }
 *     resp: { modelVersion, embeddings: [{ lat, lon, vector: number[] }] }
 *
 *   POST /reconstruct
 *     body: { date, points: [{lat, lon}], embeddings?: [...] }
 *     resp: { modelVersion, results: [{ lat, lon, profile: [{depth, temperature, uncertainty}] }] }
 *
 * If ML_SERVICE_URL is unreachable, both functions fall back to a deterministic
 * mock so the rest of the pipeline (storage, APIs, validation, frontend) can be
 * built and demoed independently of the model being finished.
 */

export async function generateEmbeddings({ date, points, surfaceObservations = {} }) {
  try {
    const { data } = await client.post('/embed', { date, points, surfaceObservations })
    return { ...data, isMock: false }
  } catch (err) {
    logger.warn(`[mlService] /embed unavailable, using mock generator (${err.message})`)
    return mockEmbeddings({ date, points })
  }
}

export async function generateReconstruction({ date, points, embeddings }) {
  try {
    const { data } = await client.post('/reconstruct', { date, points, embeddings })
    return { ...data, isMock: false }
  } catch (err) {
    logger.warn(`[mlService] /reconstruct unavailable, using mock generator (${err.message})`)
    return mockReconstruction({ date, points })
  }
}

// ---- Deterministic mock generators (seeded by lat/lon/date so results are stable) ----

function seededRandom(seedStr) {
  let h = 0
  for (let i = 0; i < seedStr.length; i++) h = (Math.imul(31, h) + seedStr.charCodeAt(i)) | 0
  return () => {
    h = (Math.imul(h, 1103515245) + 12345) | 0
    return ((h >>> 0) % 10000) / 10000
  }
}

function mockEmbeddings({ date, points }) {
  const embeddings = points.map(({ lat, lon }) => {
    const rand = seededRandom(`${date}-${lat}-${lon}-embed`)
    return { lat, lon, vector: Array.from({ length: 16 }, () => Number((rand() * 2 - 1).toFixed(4))) }
  })
  return { modelVersion: 'embedding-mock-v0', embeddings, isMock: true }
}

function mockReconstruction({ date, points }) {
  const results = points.map(({ lat, lon }) => {
    const rand = seededRandom(`${date}-${lat}-${lon}-recon`)
    // Surface warm, decreasing with depth, with slight lat-dependent + noise variation.
    const surfaceTemp = 27 + (12.5 - Math.abs(lat)) * 0.05 + (rand() - 0.5) * 1.5
    const profile = STANDARD_DEPTH_LEVELS.map((depth) => {
      const decay = Math.exp(-depth / 220)
      const temperature = Number((4 + (surfaceTemp - 4) * decay + (rand() - 0.5) * 0.3).toFixed(3))
      const uncertainty = Number((0.2 + depth / 2000).toFixed(3))
      return { depth, temperature, uncertainty }
    })
    return { lat, lon, profile }
  })
  return { modelVersion: 'reconstruction-mock-v0', results, isMock: true }
}

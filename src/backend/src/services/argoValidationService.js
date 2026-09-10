import Reconstruction from '../models/Reconstruction.js'
import ArgoObservation from '../models/ArgoObservation.js'
import { haversineKm } from '../utils/gridUtils.js'

/**
 * Matches ARGO float profiles to the nearest reconstruction grid cell
 * (same date, within matchToleranceKm) and computes per-depth and overall
 * validation statistics: RMSE, MAE, bias, and Pearson correlation.
 */
export async function runValidation({
  modelVersion,
  start,
  end,
  region,
  matchToleranceKm = 25,
}) {
  const dateFilter = { $gte: new Date(start), $lte: new Date(end) }

  const [reconstructions, argoObs] = await Promise.all([
    Reconstruction.find({
      modelVersion,
      date: dateFilter,
      ...(region
        ? { lat: { $gte: region.latMin, $lte: region.latMax }, lon: { $gte: region.lonMin, $lte: region.lonMax } }
        : {}),
    }).lean(),
    ArgoObservation.find({
      date: dateFilter,
      ...(region
        ? { lat: { $gte: region.latMin, $lte: region.latMax }, lon: { $gte: region.lonMin, $lte: region.lonMax } }
        : {}),
    }).lean(),
  ])

  // Index reconstructions by date (YYYY-MM-DD) for faster same-day matching.
  const byDate = new Map()
  for (const r of reconstructions) {
    const key = r.date.toISOString().slice(0, 10)
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key).push(r)
  }

  const pairsByDepth = new Map() // depth -> [{pred, obs}]
  const allPairs = []

  for (const obs of argoObs) {
    const key = obs.date.toISOString().slice(0, 10)
    const candidates = byDate.get(key)
    if (!candidates || candidates.length === 0) continue

    let nearest = null
    let nearestDist = Infinity
    for (const cand of candidates) {
      const dist = haversineKm(obs.lat, obs.lon, cand.lat, cand.lon)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = cand
      }
    }
    if (!nearest || nearestDist > matchToleranceKm) continue

    for (const obsLevel of obs.profile) {
      const predLevel = nearest.profile.find((p) => Math.abs(p.depth - obsLevel.depth) < 1e-6)
      if (!predLevel) continue
      const pair = { pred: predLevel.temperature, obs: obsLevel.temperature }
      allPairs.push(pair)
      if (!pairsByDepth.has(obsLevel.depth)) pairsByDepth.set(obsLevel.depth, [])
      pairsByDepth.get(obsLevel.depth).push(pair)
    }
  }

  const perDepth = [...pairsByDepth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([depth, pairs]) => ({ depth, ...computeStats(pairs) }))

  return {
    overall: computeStats(allPairs),
    perDepth,
  }
}

function computeStats(pairs) {
  const n = pairs.length
  if (n === 0) return { rmse: null, mae: null, bias: null, correlation: null, pairCount: 0 }

  let sumSqErr = 0
  let sumAbsErr = 0
  let sumErr = 0
  for (const { pred, obs } of pairs) {
    const err = pred - obs
    sumSqErr += err * err
    sumAbsErr += Math.abs(err)
    sumErr += err
  }

  const rmse = Math.sqrt(sumSqErr / n)
  const mae = sumAbsErr / n
  const bias = sumErr / n
  const correlation = n > 1 ? pearsonCorrelation(pairs) : null

  return {
    rmse: Number(rmse.toFixed(4)),
    mae: Number(mae.toFixed(4)),
    bias: Number(bias.toFixed(4)),
    correlation: correlation === null ? null : Number(correlation.toFixed(4)),
    pairCount: n,
  }
}

function pearsonCorrelation(pairs) {
  const n = pairs.length
  const preds = pairs.map((p) => p.pred)
  const obss = pairs.map((p) => p.obs)
  const meanPred = preds.reduce((a, b) => a + b, 0) / n
  const meanObs = obss.reduce((a, b) => a + b, 0) / n

  let num = 0
  let denomPred = 0
  let denomObs = 0
  for (let i = 0; i < n; i++) {
    const dp = preds[i] - meanPred
    const doo = obss[i] - meanObs
    num += dp * doo
    denomPred += dp * dp
    denomObs += doo * doo
  }
  const denom = Math.sqrt(denomPred * denomObs)
  return denom === 0 ? null : num / denom
}
